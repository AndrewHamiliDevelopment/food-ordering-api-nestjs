import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { ExtendedRequest, isSuperUser } from 'src/shared';
import { User } from 'src/users/entities/user.entity';
import { AddressAddDto } from './dto/address-add.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressService {
    private logger = new Logger(AddressService.name);
    constructor(@InjectRepository(Address) private readonly repository: Repository<Address>, @InjectRepository(User) private readonly userRepository: Repository<User>) {}


    list = async (req: ExtendedRequest) => {
        const {user: u, role, isBypass} = req;
        const user = <User>u;
        let proceed = false;
        let userSpecific = false;
        if(isBypass) {
            throw new BadRequestException('You are using a BYPASS account. Nothing to do here');
        } else if(isSuperUser({role})) {
            proceed = true;
        } else {
            proceed = true;
            userSpecific = true;
        }
        if(proceed) {
            if(userSpecific) {
                return await this.repository.find({where: {user: {id: user.id}}});
            }
            return await this.repository.find();
        }
    throw new UnauthorizedException('Your account is not authorized to use this module');
    }

    add = async (req: ExtendedRequest, dto: AddressAddDto) => {
        const {user: u, role, isBypass} = req;
        const user = <User>u;
        let proceed = false;
        let self = false;
        const {userId, line1, line2, cityMunicipality, province, recipientName, contactNumber, zipCode} = dto;

        if(isBypass) {
            if(!userId) {
                throw new BadRequestException('You are using a Bypass account, "userId" should be included in the request payload');
            }   
            proceed = true;
        } else {
            proceed = true;
            self = true;
        }
        if(proceed) {
            if(self) {
                return await this.repository.save({user, line1, line2, cityMunicipality, province, recipientName, contactNumber, zipCode});
            } else {
                const targetUser = await this.userRepository.findOne({where: {id: userId}});
                if(targetUser === null) {
                    throw new BadRequestException(`User (${{id: userId}}) not found`)
                }
                return await this.repository.save({user: targetUser, line1, line2, cityMunicipality, province, recipientName, contactNumber, zipCode})
            }
        }
    }

}
