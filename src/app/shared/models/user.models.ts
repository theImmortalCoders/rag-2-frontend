export interface IUserRequest {
  email: string;
  password: string;
  name: string;
  studyCycleYearA: number;
  studyCycleYearB: number;
}

export interface IUserResponse {
  id: number;
  email: string;
  password: string;
  name: string;
  studyCycleYearA: number;
  studyCycleYearB: number;
}

export interface IUserLoginRequest {
  email: string;
  password: string;
}
