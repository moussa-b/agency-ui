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

  decodeToken(): void {
    if (this.jwtToken) {
      try {
        this.decodedToken = jwtDecode<DecodedToken>(this.jwtToken);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return undefined;
  }

  getJwtToken(): string | undefined {
    return this.jwtToken;
  }
}
