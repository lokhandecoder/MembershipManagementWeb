export interface PaymentModel {
  UserId: string | null,
  MemberId: string,
  SubscriptionId: string,
  PaymentDate: string,
  PaymentAmount: number | undefined
}

export interface OnPayModel {
  UserName: string,
  MemberName: string,
  PlanName: string,
  BalanceCost: number
}