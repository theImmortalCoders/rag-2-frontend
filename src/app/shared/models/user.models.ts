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
  role: TRole;
  name: string;
  studyCycleYearA: number;
  studyCycleYearB: number;
  banned: boolean;
}

export interface IUserStatsResponse {
  games: number;
  plays: number;
  totalStorageMb: number;
  firstPlayed: string;
  lastPlayed: string;
}
