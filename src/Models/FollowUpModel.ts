import { Dayjs } from "dayjs";

export interface FollowUpModel {
    id: string;
    memberId: string;
    note: string;
    followUpDate: string;
    nextFollowUpDate: string;
    //statusId: number;
    followUpActionId: number
  }

export interface FilterDto{
  memberId : string | null;
  followUpDate : string | null;
  nextFollowUpDate:string | null;
}

export interface newFollowUp{
    memberId: string;
    note: string;
    followUpDate: string;
    nextFollowUpDate: string;
    statusId: number;
}

export interface FollowUpAction{
    id:number;
    followUpActionName:string;
}