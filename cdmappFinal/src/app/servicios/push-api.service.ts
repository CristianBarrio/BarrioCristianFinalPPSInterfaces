import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushApiService {
  private api = environment.pushApi;
  constructor(private http: HttpClient) {}

  enviarPush(token: string, title: string, body: string) {
    return this.http.post(`${this.api}/notify`, {
      token, title, body
    });
  }

  enviarPushRol(role: string, title: string, body: string) {
    return this.http.post(`${this.api}/notify-role`, {
      role, title, body
    });
  }
}
