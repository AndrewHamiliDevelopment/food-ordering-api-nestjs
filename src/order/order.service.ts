import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { orderPaginateConfig } from 'src/paginate.config';
import { Repository } from 'typeorm';
import { OrderCreateDto } from './dto/Order-create.dto';
import { Cart } from 'src/cart/entities/cart.entity';
import { Address } from 'src/address/entities/address.entity';
import { ExtendedRequest, isSuperUser, Role } from 'src/shared';
import { User } from 'src/users/entities/user.entity';
import { OrderUpdateDto } from './dto/Order-update.dto';

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  list = async (req: ExtendedRequest, query: PaginateQuery) => {
    const { user: u, role, isBypass } = req;
    const user = <User>u;
    return await this.orderList({ query, user, role, isBypass });
  };

  getOne = async (req: ExtendedRequest, id: number) => {
    return await this.repository.findOne({where: {id }, relations: ['address', 'cart', 'paymentMethod']})
  }

  create = async (req: ExtendedRequest, dto: OrderCreateDto) => {
    if (req.isBypass) {
      throw new BadRequestException('Bypass access. Nothing to do here');
    }
    const { user: u } = req;
    const user = <User>u;
    const { cartId, addressId } = dto;
    this.logger.log('🚀 ~ OrderService ~ cartId:', { cartId });
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, isCheckedOut: false, dateCheckedOut: null, user: {id: user.id} },
    });
    if (cart === null) {
      throw new BadRequestException('Cart is invalid. Please try again later');
    }
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: {id: user.id} },
    });
    if (address === null) {
      throw new BadRequestException(
        'Address is invalid. Please check the form properly',
      );
    }
    const order = await this.repository.save({ cart, address });
    await this.cartRepository.save({id: cart.id, isCheckedOut: true, dateCheckedOut: new Date()})
    return await this.repository.findOne({
      where: { id: order.id },
      relations: ['address', 'cart', 'cart.cartItems', 'cart.cartItems.product', 'paymentMethod']
    });
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
