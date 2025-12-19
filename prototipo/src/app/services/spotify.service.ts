import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private clientId = '38007cd38d554c5ca605720037b427fc';
  private clientSecret = 'c6b81b430c6747d6ad78ae48fc377bea';
  private tokenUrl = 'https://accounts.spotify.com/api/token';
  private url = 'https://api.spotify.com/v1';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(private http: HttpClient) {}

  getToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = 'grant_type=client_credentials';

    return this.http.post(this.tokenUrl, body, { headers });
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  refreshAccessToken(): Observable<any> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `grant_type=refresh_token&refresh_token=${this.refreshToken}`;

    return this.http.post(this.tokenUrl, body, { headers });
  }

  buscarArtista(nombreArtista: string): Observable<any> {
    if (!this.accessToken) {
      throw new Error('Access token is not set');
    }
  
    const url = `https://api.spotify.com/v1/search?q=${nombreArtista}&type=artist&limit=1`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  
    return this.http.get(url, { headers });
  }

  getTopCanciones(idArtista: string): Observable<any> {
    if (!this.accessToken) {
      throw new Error('Access token is not set');
    }
    const url = `https://api.spotify.com/v1/artists/${idArtista}/top-tracks?market=US&limit=${32}&offset=${0}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });

    return this.http.get(url, { headers });
  }

  getCancionesArtista(idArtista: string): Observable<any> {
    if (!this.accessToken) {
      throw new Error('Access token is not set');
    }

    const url = `${this.url}/artists/${idArtista}/albums?include_groups=album,single&limit=50`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });

    return this.http.get(url, { headers });
  }

}
