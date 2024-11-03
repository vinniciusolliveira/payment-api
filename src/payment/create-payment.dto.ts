export interface Address {
    zip_code: string;
    city: string;
    neighborhood: string;
    street_name: string;
    street_number: string;
    federal_unit: string;
}

export interface Identification {
    type: string;
    number: string;
}

export interface Payer {
    email: string;
    first_name: string;
    last_name: string;
    identification: Identification;
    address: Address;
  }
  
  export interface CreatePaymentDto {
    transaction_amount: number;
    token: string;
    description: string;
    installments: number;
    payment_method_id: string;
    payer: Payer;
  }