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

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private app = '';
  private env = '';
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @InjectRepository(UserDetail)
    private readonly userDatailRepository: Repository<UserDetail>,
    private readonly configService: ConfigService,
  ) {
    this.app = configService.getOrThrow<string>('DATABASE_NAME');
    this.env = configService.getOrThrow<string>('NODE_ENV');
  }

  list = async (req: ExtendedRequest, query: PaginateQuery) => {
    const role = req.role;
    if (isSuperUser({ role })) {
      return paginate(query, this.repository, userPaginateConfig);
    }
    throw new UnauthorizedException(
      'Your account is not allowed to use this module',
    );
  };

  me = (req: ExtendedRequest) => {
    const { user: u } = req;
    const user = <User>u;
    return user;
  };

  getOne = async (props: { id: number }): Promise<User> => {
    const { id } = props;
    const user = await this.repository.findOne({ where: { id } });
    if (user === null) {
      throw new NotFoundException(`User with ID: ${id} not foud`);
    }
    return user;
  };
  create = async (props: { req: ExtendedRequest; dto: UserCreateDto }) => {
    const { dto, req } = props;
    const userRole = req.role;
    if (isSuperUser({ role: userRole })) {
      const { email, emailVerified, notifyAccountCreation, role } = dto;
      const userRecord = await firebaseGetOrCreateUser({
        email,
        emailVerified,
      });
      if (userRecord === null) {
        throw new BadRequestException(
          `An error has occurred when creating a new user with email: ${email}`,
        );
        if (notifyAccountCreation) {
          //TODO: integrate SMTP service and send email
        }
      }
      const { uid, displayName, phoneNumber, photoURL, disabled } = userRecord;
      const user = await this.repository.save({
        uid,
        email,
        emailVerified,
        displayName,
        phoneNumber,
        photoURL,
        disabled,
      });
      const { id } = user;

      firebaseSetCustomUserClaims({
        app: this.app,
        env: this.env,
        uid: user.uid,
        role,
      });

      return await this.repository.findOne({
        where: { id },
        relations: ['userDetail'],
      });
    }
    throw new UnauthorizedException(
      'Your account is allowed to use this module',
    );
  };
  update = async (props: {
    req: ExtendedRequest;
    userId: number;
    dto: UserUpdateDto;
  }) => {
    const { userId, dto, req } = props;
    const { lastName, firstName, middleName, role } = dto;
    if (req.isBypass) {
      this.logger.log('===== BYPASS =====');
      const user = await this.repository.findOne({ where: { id: userId } });
      if (user === null)
        throw new BadRequestException(`User with ID: ${userId} not found`);
      const userDetail = await this.userDatailRepository.findOne({
        where: { user: { id: userId } },
      });
      if (userDetail !== null) {
        await this.userDatailRepository.save({
          ...userDetail,
          lastName,
          firstName,
          middleName,
        });
        await firebaseSetCustomUserClaims({
          app: this.app,
          env: this.env,
          uid: user.uid,
          role,
        });
      } else {
        await this.userDatailRepository.save({
          user,
          lastName,
          firstName,
          middleName,
        });
      }
      return await this.repository.findOne({ where: { id: userId } });
    } else {
      const { user: u } = req;
      const user = <User>u;
      const superUser = isSuperUser({ role: req.role });
      this.logger.log('ID', userId);
      const self = user.id === userId;
      if (!superUser) {
        this.logger.log('===== This is not a SUPERUSER =====');
        if (self) {
          const userDetail = await this.userDatailRepository.findOne({
            where: { user: { id: user.id } },
          });
          if (userDetail !== null) {
            this.logger.log('Update UserDetail');
            await this.userDatailRepository.save({
              ...userDetail,
              lastName,
              firstName,
              middleName,
            });
          } else {
            this.logger.log('Create UserDetail');
            await this.userDatailRepository.save({
              user,
              lastName,
              firstName,
              middleName,
            });
          }
        } else {
          throw new ForbiddenException(
            'Your account is not allowed to modify someone\s account.',
          );
        }
        return await this.repository.findOne({
          where: { id: user.id },
          relations: ['userDetail'],
        });
      } else {
        this.logger.log('===== This is a SUPERUSER =====');
        await this.userDatailRepository.save({
          user,
          lastName,
          firstName,
          middleName,
        });

        if (!self) {
          await firebaseSetCustomUserClaims({
            app: this.app,
            env: this.env,
            uid: user.uid,
            role,
          });
        } else {
          throw new ForbiddenException(
            'Your account is not allowed to modify your own role',
          );
        }
      }
    }
  };
}
