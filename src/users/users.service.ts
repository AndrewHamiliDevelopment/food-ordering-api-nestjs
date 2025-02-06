import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { userPaginateConfig } from 'src/paginate.config';
import { UserCreateDto } from './dto/user-create.dto';
import { firebaseCreateUser } from 'src/shared';
import { ConfigService } from '@nestjs/config';
import { UserUpdateDto } from './dto/User-update.dto';
import { UserDetail } from './entities/user-detail.entity';

@Injectable()
export class UsersService {
    private app = '';
    private env = '';
    constructor(@InjectRepository(User) private readonly repository: Repository<User>, @InjectRepository(UserDetail) private readonly userDatailRepository: Repository<UserDetail>, private readonly configService: ConfigService) {
        this.app = configService.getOrThrow<string>('DATABASE_NAME');
        this.env = configService.getOrThrow<string>('NODE_ENV');
    }

    list = async (query: PaginateQuery) => {
        return paginate(query, this.repository, userPaginateConfig);
    }

    getOne = async (props: {id: number}): Promise<User> => {
        const { id } = props;
        const user = await this.repository.findOne({where: { id }});
        if(user === null) {
            throw new NotFoundException(`User with ID: ${id} not foud`);
        }
        return user;
    }
    create = async (props: {dto: UserCreateDto}) => {
        const { dto } = props;
        const {email, emailVerified, notifyAccountCreation} = dto;
        const userRecord = await firebaseCreateUser({email, emailVerified});
        if(userRecord === null) {
            throw new BadRequestException(`An error has occurred when creating a new user with email: ${email}`)
        }
        const { uid, displayName, phoneNumber, photoURL, disabled } = userRecord;
        const user = await this.repository.save({uid, displayName, phoneNumber, photoURL, disabled});
        const { id } = user;

        return await this.repository.findOne({where: { id }, relations: ['userDetail']})

    }
    update = async (props: {userId: number; dto: UserUpdateDto}) => {
        const {userId, dto} = props;
        const {lastName, firstName, middleName} = dto;
        const user = await this.repository.findOne({where: { id: userId }})
        const { id } = user;
        let userDetail = await this.userDatailRepository.findOne({where: { user: { id } }});
        if(userDetail === null) {
            await this.userDatailRepository.save({user,  lastName, firstName, middleName})
        }
        await this.userDatailRepository.save({user, lastName, firstName, middleName});

        return await this.repository.findOne({where: { id }, relations: ['userDetail']})
        
    }

}
