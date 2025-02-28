import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { userPaginateConfig } from 'src/paginate.config';
import { UserCreateDto } from './dto/user-create.dto';
import {
  ExtendedRequest,
  firebaseGetOrCreateUser,
  firebaseSetCustomUserClaims,
  isSuperUser,
  Role,
} from 'src/shared';
import { ConfigService } from '@nestjs/config';
import { UserUpdateDto } from './dto/User-update.dto';
import { UserDetail } from './entities/user-detail.entity';
import { Address } from '../address/entities/address.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private app = '';
  private env = '';
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @InjectRepository(UserDetail)
    private readonly userDatailRepository: Repository<UserDetail>,
    private readonly configService: ConfigService,
  ) {
    this.app = configService.getOrThrow<string>('DATABASE_NAME');
    this.env = configService.getOrThrow<string>('NODE_ENV');
  }

  list = async (req: ExtendedRequest, query: PaginateQuery) => {
    let proceed = false;
    if(req.isBypass)  {
      proceed = true;
    } else if(isSuperUser({ role: req.role })) {
      proceed = true;
    }
    if(proceed) {
      return paginate(query, this.repository, userPaginateConfig);
    } else {
      throw new UnauthorizedException('Your account is not authorized to use this module');
    }
  };

  me = (req: ExtendedRequest) => {
    if(req.isBypass) {
      throw new BadRequestException('You are using a BYPASS account, nothing to do here');
    }
    const { user: u } = req;
    const user = <User>u;
    return user;
  };

  getOne = async (req: ExtendedRequest, props: { id: number }): Promise<User> => {
    let proceed = false;
    const role = req.role;
    if(req.isBypass) {
      proceed = true;
    } else if (isSuperUser({role})) {
      proceed = true;
    }
    if(proceed) {
      const { id } = props;
    const user = await this.repository.findOne({ where: { id } });
    if (user === null) {
      throw new NotFoundException(`User with ID: ${id} not foud`);
    }
    return user;
    }else {
      throw new UnauthorizedException('Your account is not authorized to use this module');
    }
  };
  create = async (props: { req: ExtendedRequest; dto: UserCreateDto }) => {
    const { dto, req } = props;
    const role = req.role;
    let proceed = false;
    if(req.isBypass ){
      proceed = true
    } else {
      if(isSuperUser({role})) {
        proceed = true;
      }
    }
    if (proceed) {
      const {email, emailVerified, notifyAccountCreation, role} = dto;
      const userRecord = await firebaseGetOrCreateUser({
        email,
        emailVerified,
        role
      });
      if(userRecord === null) {
        throw new BadRequestException(`An error has occurred while creating a new user for "${email}"`)
      }
      const {uid, displayName, phoneNumber, photoURL, disabled} = userRecord;
      const user = await this.repository.save({uid, displayName, phoneNumber, photoURL, disabled});
      const { id } = user;
      firebaseSetCustomUserClaims({app: this.app, env: this.env, role, uid});
      return await this.repository.findOne({where: { id }});
    } else {
      throw new UnauthorizedException('Your account is not authorized to use this module');
    }
  };
  update = async (props: {
    req: ExtendedRequest;
    userId: number;
    dto: UserUpdateDto;
  }) => {
    const { userId, dto, req } = props;
    console.log("🚀 ~ UsersService ~ props:", props)
    const { user: u} = req
    const user = <User>u;
    const role = req.role;
    let proceed = false;
    if(req.isBypass) {
      proceed = true;
    } else if (isSuperUser({role})) {
      proceed = true;
    } else if(userId === user.id) {
      proceed = true;
    }
    if(proceed) {
      const {lastName, firstName, middleName, role} = dto;
      if(!req.isBypass) {
        if(userId === user.id) {
          if(role !== dto.role) {
            throw new UnauthorizedException('You are not allowed to change your role');
          }
        }
      }
      const updateUser = await this.repository.findOne({where: {id: userId}});
      const updateUserDetail = await this.userDatailRepository.findOne({where: {user: {id: updateUser.id}}});
      await this.userDatailRepository.save({...updateUserDetail, lastName, firstName, middleName});
      await firebaseSetCustomUserClaims({app: this.app, env: this.env, uid: updateUser.uid, role})
      return await this.repository.findOne({
          where: { id: updateUser.id },
          relations: ['userDetail', 'address'],
        });
    } else {
      throw new UnauthorizedException('Your account is not allowed to use this module.')
    }
  };

}
