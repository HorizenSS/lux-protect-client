import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

interface StoredUser {
  token: string;
  customerDTO: {
    id: number;
    name: string;
    email: string;
    gender: string;
    age: number;
    roles: string[];
    username: string;
    profileImageId: string | null;
  };
}
@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData: StoredUser = JSON.parse(userStr);
      return userData.customerDTO;
    }
    return null;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  getCurrentUserRole(): string[] {
    const user = this.getCurrentUser();
    return user ? user.roles : [];
  }

  isAdmin(): boolean {
    const roles = this.getCurrentUserRole();
    return roles.includes('ADMIN');
  }

}
