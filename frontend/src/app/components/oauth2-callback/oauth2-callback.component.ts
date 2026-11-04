
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-oauth2-callback',
  template: `<p>Signing you in with Google...</p>`
})
export class OAuth2CallbackComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const code = new URLSearchParams(window.location.search).get('code');

    if (!code) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/oauth2/exchange`,
      { code }
    ).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('username', response.username);
        sessionStorage.setItem('role', response.role);

        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
