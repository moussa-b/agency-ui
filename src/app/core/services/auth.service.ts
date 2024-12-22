import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../../users/entities/user.entity';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';

export interface DecodedToken {
  sub: number;
  role: UserRole;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtToken?: string;
  decodedToken?: DecodedToken;

  constructor(private storageService: StorageService,
              private http: HttpClient) {
    this.jwtToken = this.storageService.get('jwtToken') ? this.storageService.get('jwtToken')! : undefined;
  }

  login(username: string, password: string, rememberMe: boolean): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${environment.API_URL}/api/auth/login`, {username, password})
      .pipe(map((response: { access_token: string }) => {
        if (rememberMe) {
          this.storageService.setStorage(localStorage);
        }
        this.jwtToken = response.access_token;
        this.storageService.set('jwtToken', this.jwtToken);
        return response;
      }));
  }

  activate(username: string, password: string, activationToken: string): Observable<{status: boolean}> {
    return this.http.post<{status: boolean}>(`${environment.API_URL}/api/auth/activate`, {username, password, activationToken});
  }

  logout(): void {
    this.jwtToken = undefined;
    this.decodedToken = undefined;
    this.storageService.remove('jwtToken');
  }

  isAuthenticated(): boolean {
    return !!(this.jwtToken && this.jwtToken?.length > 0) && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const expiryTime = this.getExpiryTime();
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }

  getExpiryTime(): number | undefined {
    this.decodeToken();
    return this.decodedToken?.exp;
  }

  getRole(): UserRole {
    this.decodeToken();
    if (this.decodedToken && this.decodedToken.role) {
      if (this.decodedToken.role === UserRole.ADMIN) {
        return UserRole.ADMIN;
      } else if (this.decodedToken.role === UserRole.MANAGER) {
        return UserRole.MANAGER;
      }
    }
    return UserRole.USER;
  }

  get isAdmin() {
    return UserRole.ADMIN === this.getRole();
  }

  get isManager() {
    return UserRole.MANAGER === this.getRole();
  }

  decodeToken(): void {
    if (this.jwtToken && !this.decodedToken) {
      try {
        this.decodedToken = jwtDecode<DecodedToken>(this.jwtToken);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  getJwtToken(): string | undefined {
    return this.jwtToken;
  }
}
