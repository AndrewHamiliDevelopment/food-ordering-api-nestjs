import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paymentMethodPaginateConfig } from 'src/paginate.config';
import { PaymentMethodAddDto } from './dto/PaymentMethodAdd.dto';
import { PaymentMethodUpdateDto } from './dto/PaymentMethodUpdate.dto';

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

  create = async (dto: PaymentMethodAddDto) => {
    const { name, description, additionalNotes } = dto;
    return await this.repository.save({ name, description, additionalNotes });
  };

  update = async (props: { id: number; dto: PaymentMethodUpdateDto }) => {
    const { id, dto } = props;
    const { name, description, additionalNotes, enabled } = dto;
    const paymentMethod = await this.repository.findOne({ where: { id } });
    return await this.repository.save({
      ...paymentMethod,
      name,
      description,
      additionalNotes,
      enabled,
    });
  };
}
