export interface SubscriptionModel{
  planId: string,
  planCost: number,
  plan: string | null,
  memberId: string,
  startDate: string,
  endDate: string,
  discountAmount: number,
  costAfterDiscount: number,
  cgst: number,
  sgst: number,
  totalAmount: number,
  paidAmount: number,
  balanceAmount: number,
  id: string
}

export interface PlanModel{
  planName: string;
  planDuration: number;
  durationTypeId: number;
  durationType: string;
  planCost: number;
  isActive: boolean;
  id: string; 
}