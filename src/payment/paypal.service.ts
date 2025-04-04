import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PaymentModel } from './model/paypal/payment.model';
import { PaymentResponseModel } from './model/paypal/payment-response.model';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class PaypalService {
  private readonly logger = new Logger(PaypalService.name);
  private axiosInstance: AxiosInstance;
  constructor(private readonly configService: ConfigService) {
    const baseURL = this.configService.getOrThrow<string>('PAYPAL_API_BASE_URL');
    this.axiosInstance = axios.create({ baseURL });
  }

  generatePayment = async (payload: PaymentModel): Promise<AxiosResponse<PaymentResponseModel>> => {
    return await this.axiosInstance.post('/pay', payload);
  };

  executePayment = async (props: { paymentId?: string; token?: string; PayerID?: string }) => {
    const { paymentId, token, PayerID } = props;
    const params = new URLSearchParams();
    if (paymentId) {
      params.append('paymentId', paymentId);
    }
    if (token && PayerID) {
      params.append('token', token);
      params.append('PayerID', PayerID);
    }
    return this.axiosInstance.get(`/pay`, { params });
  };
}
