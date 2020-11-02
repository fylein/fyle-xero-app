import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      router.navigate(['/workspaces']);
    }
  }

  login() {
    this.authService.redirectToLogin();
  }

  ngOnInit() {
  }
}
