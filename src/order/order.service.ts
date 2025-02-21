import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { orderPaginateConfig } from 'src/paginate.config';
import { Repository } from 'typeorm';
import { OrderCreateDto } from './dto/Order-create.dto';
import { Cart } from 'src/cart/entities/cart.entity';
import { Address } from 'src/users/entities/address.entity';
import { ExtendedRequest } from 'src/shared';
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

  list = (req: ExtendedRequest, query: PaginateQuery) => {
    const { user: u } = req;
    const user = <User>u;
    return paginate(query, this.repository, {
      ...orderPaginateConfig,
      where: { cart: { user: { id: user.id } } },
    });
  };

  create = async (req: ExtendedRequest, dto: OrderCreateDto) => {
    if (req.isBypass) {
      throw new BadRequestException('Bypass access. Nothing to do here');
    }
    const { user: u } = req;
    const user = <User>u;
    const { cartId, addressId } = dto;
    this.logger.log('🚀 ~ OrderService ~ cartId:', { cartId });
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, isCheckedOut: false, dateCheckedOut: null, user },
    });
    if (cart === null) {
      throw new BadRequestException('Cart is invalid. Please try again later');
    }
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user },
    });
    if (address === null) {
      throw new BadRequestException(
        'Address is invalid. Please check the form properly',
      );
    }
    const order = await this.repository.save({ cart, address });
    return await this.repository.findOne({
      where: { id: order.id },
      relations: ['cart', 'cart.user', 'cart.cartItems', 'address'],
    });
  };

  update = async (req: ExtendedRequest, dto: OrderUpdateDto) => {
    throw new BadRequestException('Not implemented');
  };
}
