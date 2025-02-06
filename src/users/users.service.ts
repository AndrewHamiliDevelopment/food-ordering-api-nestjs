import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { userPaginateConfig } from 'src/paginate.config';
import { UserCreateDto } from './dto/user-create.dto';
import { firebaseCreateUser } from 'src/shared';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

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
        return await this.repository.save({uid, displayName, phoneNumber, photoURL, disabled});
    }
    update = async (props: {dto: UserCreateDto}) => {

    }

}
