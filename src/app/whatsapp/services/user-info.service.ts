import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toUserInfoView, UserInfo, UserInfoView } from '../models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  private readonly apiBase = `${environment.apiUrl}/usuarios/info`;
  private readonly cache = new Map<number, Observable<UserInfoView>>();

  constructor(private readonly http: HttpClient) {}

  getUserInfo(idUsuario: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiBase}/${idUsuario}`);
  }

  getUserInfoView(idUsuario: number): Observable<UserInfoView> {
    const cached = this.cache.get(idUsuario);
    if (cached) return cached;

    const request$ = this.getUserInfo(idUsuario).pipe(
      map(toUserInfoView),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    this.cache.set(idUsuario, request$);
    return request$;
  }

  clearCache(idUsuario?: number): void {
    if (idUsuario === undefined) {
      this.cache.clear();
      return;
    }
    this.cache.delete(idUsuario);
  }
}
