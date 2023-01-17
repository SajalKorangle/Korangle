
export type ModeOfPayment = {
    id: number,
    name: string,
    parentPaymentGateway: number,
    apiCode: string,
    parentPaymentGatewayInstance: PaymentGateway,
    modeofpaymentcharges: ModeOfPaymentCharges[],
}

export type PaymentGateway = {
    id: number,
    name: string,
}

export type ModeOfPaymentCharges = {
    id: number,
    parentModeOfPayment: number,
    chargeType: string,
    charge: number,
    minimumAmount: number,
    maximumAmount: number,
}
