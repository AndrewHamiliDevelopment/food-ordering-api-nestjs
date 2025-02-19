import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paymentMethodPaginateConfig } from 'src/paginate.config';
import { PaymentMethodAddDto } from './dto/PaymentMethodAdd.dto';
import { PaymentMethodUpdateDto } from './dto/PaymentMethodUpdate.dto';
import { ExtendedRequest, isSuperUser } from 'src/shared';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly repository: Repository<PaymentMethod>,
  ) {}

  list = (query: PaginateQuery) => {
    return paginate(query, this.repository, {
      ...paymentMethodPaginateConfig,
      where: { enabled: true },
    });
  };

  create = async (req: ExtendedRequest, dto: PaymentMethodAddDto) => {
    let proceed = false;
    if (req.isBypass) {
      proceed = true;
    } else {
      const role = req.role;
      const superUser = isSuperUser({ role });
      if (superUser) {
        proceed = true;
      }
    }
    if (proceed) {
      const { name, description, additionalNotes } = dto;
      return await this.repository.save({ name, description, additionalNotes });
    }
    throw new UnauthorizedException(
      'Your account is not allowed to use this module',
    );
  };

  update = async (props: {
    req: ExtendedRequest;
    id: number;
    dto: PaymentMethodUpdateDto;
  }) => {
    const { id, dto, req } = props;
    let proceed = false;
    if (req.isBypass) {
      proceed = true;
    } else {
      const role = req.role;
      const superUser = isSuperUser({ role });
      if (superUser) {
        proceed = true;
      }
    }
    if (proceed) {
      const { name, description, additionalNotes, enabled } = dto;
      const paymentMethod = await this.repository.findOne({ where: { id } });
      return await this.repository.save({
        ...paymentMethod,
        name,
        description,
        additionalNotes,
        enabled,
      });
    }
    throw new UnauthorizedException(
      'Your account is not authorized to use this module',
    );
  };
}
