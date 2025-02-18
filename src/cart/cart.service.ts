import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { ExtendedRequest } from 'src/shared';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductSnapshot } from 'src/product/entities/product-snapshot.entity';
import { CartAddProductDto } from './dto/cart-add-product.dto';

@Injectable()
export class CartService {
  private logger = new Logger(CartService.name);
  constructor(
    @InjectRepository(Cart) private readonly repository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductSnapshot)
    private readonly productSnapshotRepository: Repository<ProductSnapshot>,
  ) {}

  get = async (req: ExtendedRequest) => {
    const { user: u } = req;
    const user = <User>u;
    const { id: userId } = user;
    return await this.getOrCreate(userId);
  };

  addToCart = async (props: {
    dto: CartAddProductDto;
    req: ExtendedRequest;
  }) => {
    const { req, dto } = props;
    const { productId } = dto;
    const { user: u } = req;
    const user = <User>u;
    const cart = await this.getOrCreate(user.id);
    const product = await this.productRepository.findOne({
      where: { id: productId, enabled: true },
      relations: ['category', 'thumbnail', 'images'],
    });
    if (product !== null) {
      const { name, description, price, category, thumbnail, enabled } =
        product;
      const productSnapshot = await this.productSnapshotRepository.save({
        product,
        category,
        thumbnail,
        name,
        description,
        price,
        enabled,
      });
      const cartItem = await this.cartItemRepository.findOne({
        where: {
          cart: { id: cart.id },
          product: { product: { id: product.id } },
        },
      });
      if (cartItem !== null) {
        const quantity = cartItem.quantity + 1;
        await this.cartItemRepository.save({ ...cartItem, quantity });
      } else {
        const quantity = 1;
        await this.cartItemRepository.save({
          cart,
          quantity,
          product: productSnapshot,
        });
      }
      return await this.getOrCreate(user.id);
    } else {
      throw new BadRequestException(
        'Product does not exist. Please try again later',
      );
    }
  };

  removeToCart = async (props: {
    dto: CartAddProductDto;
    req: ExtendedRequest;
  }) => {
    const { req, dto } = props;
    const { productId } = dto;
    const { user: u } = req;
    const user = <User>u;
    const cart = await this.getOrCreate(user.id);
    const product = await this.productRepository.findOne({
      where: { id: productId, enabled: true },
      relations: ['category', 'thumbnail', 'images'],
    });
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { product: { id: product.id } },
      },
    });
    if (cartItem !== null) {
      if (cartItem.quantity > 1) {
        this.logger.log('DEDUCT');
        cartItem.quantity = cartItem.quantity - 1;
        await this.cartItemRepository.save(cartItem);
      } else {
        this.logger.log('DELETE');
        await this.cartItemRepository.delete(cartItem.id);
      }
    }
    return this.getOrCreate(user.id);
  };

  checkout = async (req: ExtendedRequest) => {
    const { user: u } = req;
    const user = <User>u;
    const { id: userId } = user;
    const cart = await this.getOrCreate(userId);
    await this.repository.save({
      ...cart,
      isCheckedOut: true,
      dateCheckedOut: new Date(),
    });
  };

  private getOrCreate = async (userId: number) => {
    this.logger.log(`User ID: `, { userId });
    let cart = await this.repository.findOne({
      where: { user: { id: userId }, isCheckedOut: false },
      relations: ['cartItems', 'cartItems.product'],
    });
    if (cart === null) {
      this.logger.log('No cart exists for user. Create a new cart');
      const user = await this.userRepository.findOne({ where: { id: userId } });
      cart = await this.repository.save({ user, dateCheckedOut: null });
      cart = await this.repository.findOne({
        where: { user: { id: userId }, isCheckedOut: false },
        relations: ['cartItems'],
      });
      this.logger.log('Cart', cart);
      return cart;
    }
    this.logger.log('Cart', cart);
    return cart;
  };
}
