export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    mobileNumber: number;
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