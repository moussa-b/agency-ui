import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './entities/user.entity';
import { environment } from '../../environments/environment';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.API_URL}/api/users`);
  }

  create(createUserDto: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${environment.API_URL}/api/users`, createUserDto);
  }
}
