export interface UserSignup {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  mobileNumber: number | undefined;
  password: string;
}

export interface UserSignIn{
  emailAddress: string;
  password : string;
}
