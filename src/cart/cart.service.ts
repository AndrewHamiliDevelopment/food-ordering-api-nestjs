import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { ExtendedRequest } from 'src/shared';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartService {
  private logger = new Logger(CartService.name);
  constructor(
    @InjectRepository(Cart) private readonly repository: Repository<Cart>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  get = async (req: ExtendedRequest) => {
    const { user: u } = req;
    const user = <User>u;
    const { id: userId } = user;
    return await this.getOrCreate(userId);
  };
  private getOrCreate = async (userId: number) => {
    this.logger.log(`User ID: `, { userId });
    let cart = await this.repository.findOne({
      where: { user: { id: userId }, isCheckedOut: false },
    });
    if (cart === null) {
      this.logger.log('No cart exists for user. Create a new cart');
      const user = await this.userRepository.findOne({ where: { id: userId } });
      cart = await this.repository.save({ user, dateCheckedOut: null });
      this.logger.log('Cart', cart);
      return cart;
    }
    this.logger.log('Cart', cart);
    return cart;
  };
}
