import { Injectable } from '@angular/core';
import { TRole } from '../models/role.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  public async isAuthenticated(): Promise<boolean> {
    //todo
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
  public async getCurrentRole(): Promise<TRole> {
    return new Promise<TRole>(resolve => {
      setTimeout(() => {
        resolve(TRole.Admin);
      }, 500);
    });
  }
}
