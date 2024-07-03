import { Injectable } from '@angular/core';
import { TRole } from '../models/role.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  public isAuthenticated(): boolean {
    return true; //todo
  }
  public getCurrentRole(): TRole {
    return TRole.Admin; //todo
  }
}
