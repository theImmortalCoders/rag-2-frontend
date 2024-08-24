import { TRole } from './role.enum';

export interface IUserRequest {
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

export interface IUserResponse {
  id: number;
  email: string;
  //do rzutowania na TRole po odebraniu danych
  role: string;
  name: string;
  studyCycleYearA: number;
  studyCycleYearB: number;
}

export interface IUserDetailsResponse {
  id: number;
  email: string;
  //do rzutowania na TRole po odebraniu danych
  role: string;
  name: string;
  studyCycleYearA: number;
  studyCycleYearB: number;
}
