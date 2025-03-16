import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Order, PAYMENT_METHOD } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { orderPaginateConfig } from 'src/paginate.config';
import { DataSource, Repository } from 'typeorm';
import { OrderCreateDto } from './dto/Order-create.dto';
import { Cart } from 'src/cart/entities/cart.entity';
import { Address } from 'src/address/entities/address.entity';
import { ExtendedRequest, isSuperUser, Role } from 'src/shared';
import { User } from 'src/users/entities/user.entity';
import { OrderUpdateDto } from './dto/Order-update.dto';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { CartService } from 'src/cart/cart.service';
import { AddressService } from 'src/address/address.service';
import { PaymentMethodService } from 'src/payment-method/payment-method.service';
import { PaymentService } from 'src/payment/payment.service';
import { PaypalPaymentMethod } from 'src/payment/payment.method';
import { PaypalService } from 'src/payment/paypal.service';
import { toArray } from 'lodash';

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
    private paymentMethodService: PaymentMethodService,
  ) {}

  list = async (req: ExtendedRequest, query: PaginateQuery) => {
    const { user: u, role, isBypass } = req;
    const user = <User>u;
    return await this.orderList({ query, user, role, isBypass });
  };

  getOneInternal = async (id: number) => {
    return await this.repository.findOne({where: {id}, relations: orderPaginateConfig.relations});
  }

  getOne = async (req: ExtendedRequest, id: number) => {
    const {user: u, isBypass, role} = req;
    const user = <User>u;
    let proceed = false;
    let order: Order | null;
    if(isBypass) {
      proceed = true;
      order = await this.repository.findOne({where: { id }, relations: orderPaginateConfig.relations});
    } else {
      order = await this.repository.findOne({where: { id, cart: {user: {id: user.id}} }, relations: orderPaginateConfig.relations});
      if(order !== null) {
        proceed = true;
      }
    }
    if(proceed) {
      return order;
    }
    throw new UnauthorizedException('Your account is not allowed to use this module');
  }

  getOneByUuid = async (uuid: string) => {
    return await this.repository.findOne({where: {uuid}, relations: orderPaginateConfig.relations});
  }

  create = async (req: ExtendedRequest, dto: OrderCreateDto) => {
    this.logger.log(`Start creating order: ${JSON.stringify(dto)}`)
    if (req.isBypass) {
      throw new BadRequestException('Bypass access. Nothing to do here');
    }
    const { user: u } = req;
    const user = <User>u;
    const { cartId, addressId, paymentMethod } = dto;
    const cart = await this.cartService.get(req, cartId);
    if(cart === null) {
      this.logger.error(`Cart ID: ${cartId} is invalid or already checked out`);
      throw new BadRequestException('Cart is invalid');
    }
    if(cart.cartItems.length < 1) {
      this.logger.error('No item/s in cart');
      throw new BadRequestException('No item/s in cart');
    }
    const address = await this.addressService.getOneWithUserInternal({id: addressId, userId: user.id});
    if(address === null) {
      this.logger.log(`Address ID: ${addressId} not found.`)
      throw new BadRequestException(`Address not found.`);
    }
    const order = await this.repository.save({ cart, address, paymentMethod });
    return await this.getOneInternal(order.id);
  };

  update = async (
    req: ExtendedRequest,
    props: { dto: OrderUpdateDto; id: number },
  ) => {
    let proceed: boolean = false;
    if (req.isBypass) {
      proceed = true;
    } else {
      const { role } = req;
      if (isSuperUser({ role })) {
        proceed = true;
      }
    }
    if (proceed) {
      const { dto, id } = props;
      const { user: u } = req;
      const user = <User>u;
      const order = this.repository.findOne({
        where: { id, cart: { user: { id: user.id } } },
      });
      if (order !== null) {
        const { status } = dto;
        await this.repository.save({ ...order, status });
        return await this.repository.findOne({
          where: { id },
          relations: ['cart', 'cart.user', 'address', 'paymentMethod'],
        });
      } else {
        throw new NotFoundException(`Order ID: ${id} not found`);
      }
    }
  };

  paymentMethods = () => {
    return toArray(PAYMENT_METHOD)
  }

  private orderList = async (props: {
    query: PaginateQuery;
    user: User;
    role: Role;
    isBypass: boolean;
  }) => {
    const { isBypass, user, role, query } = props;
    if (isBypass || isSuperUser({ role })) {
      this.logger.log('BYPASS User, return all without user filter');
      return await paginate(query, this.repository, orderPaginateConfig);
    } else {
      this.logger.log('Regular User, return orders filtered by user');
      return await paginate(query, this.repository, {
        ...orderPaginateConfig,
        where: { cart: { user: { id: user.id } } },
      });
    }
  };
}
