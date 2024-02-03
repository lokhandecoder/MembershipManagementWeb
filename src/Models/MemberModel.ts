export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    mobileNumber: number | undefined;
    address: string;
    dob: string;
    genderId: number;
    isActive: boolean;
  }

export interface Gender {
  id: number;
  genderCode: string;
  genderName: string;
}

export interface FilterDto {
  genderId: number;
  firstName: string | null;
  nameMemberId: string | null;
  emailMemberId: string | null;
  numberMemberId: string | null;
  emailAddress: string | null;
  mobileNumber: number | undefined;
}