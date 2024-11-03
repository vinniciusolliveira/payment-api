// src/payment/payment.service.ts

import { Injectable } from '@nestjs/common';
import { CardToken, MercadoPagoConfig, Payment } from 'mercadopago';
import { CreatePaymentDto } from './create-payment.dto'; // Importar a interface
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config(); // Carregar as variáveis de ambiente

const accessToken = process.env.MP_ACCESS_TOKEN;

@Injectable()
export class PaymentService {
  private client: MercadoPagoConfig;
  private payment: Payment;

  constructor() {
    // Inicializar o cliente com o access token
    this.client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
        idempotencyKey: 'abc',
      },
    });

    // Inicializar o objeto de pagamento
    this.payment = new Payment(this.client);
  }

  async createPayment(
    createPaymentDto: CreatePaymentDto // Usar a interface aqui
  ): Promise<any> {
    // Criar o objeto de requisição
    const idempotencyKey = uuidv4();
    const body = {
      transaction_amount: createPaymentDto.transaction_amount,
      token: createPaymentDto.token,
      description: createPaymentDto.description,
      installments: createPaymentDto.installments || 1,
      payment_method_id: createPaymentDto.payment_method_id,
      payer: {
        email: createPaymentDto.payer.email, // Acessar o email do payer
        first_name: createPaymentDto.payer.first_name,
        last_name: createPaymentDto.payer.last_name,
        identification: {
            type: createPaymentDto.payer.identification.type,
            number: createPaymentDto.payer.identification.number
        },
        address: {
            zip_code: createPaymentDto.payer.address.zip_code,
            city: createPaymentDto.payer.address.city,
            neighborhood: createPaymentDto.payer.address.neighborhood,
            street_name: createPaymentDto.payer.address.street_name,
            street_number: createPaymentDto.payer.address.street_number,
            federal_unit: createPaymentDto.payer.address.federal_unit,
        }
      },
    };

    console.log('Corpo da requisição:', body);

    // Criar as opções de requisição (opcional)
    const requestOptions = {
      idempotencyKey // Defina o idempotencyKey conforme necessário
    };

    // Fazer a requisição para criar o pagamento
    try {
      const response = await this.payment.create({ body, requestOptions });
      return response; // Retornar a resposta
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar pagamento');
    }
  }
}
