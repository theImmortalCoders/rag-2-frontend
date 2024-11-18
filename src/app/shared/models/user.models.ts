import { TRole } from './role.enum';

export interface IUserRequest {
  email: string;
  password: string;
  name: string;
  studyCycleYearA: number | null;
  studyCycleYearB: number | null;
}

export interface IUserLoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface IUserResponse {
  id: number;
  email: string;
  role: TRole;
  name: string;
  studyCycleYearA: number;
  studyCycleYearB: number;
  lastPlayed: string;
  banned: boolean;
}

export interface IUserStatsResponse {
  games: number;
  plays: number;
  totalStorageMb: number;
  firstPlayed: string;
  lastPlayed: string;
}

export interface ILimitsResponse {
  studentLimitMb: number;
  teacherLimitMb: number;
  adminLimitMb: number;
}

export interface IUserEditRequest {
  name: string;
  studyCycleYearA: number;
  studyCycleYearB: number;
  courseId: number;
  group: string;
}
