import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IntegrationService } from '../../services/integration.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  router = inject(Router);
  errorMessage = '';
  userForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  request: LoginRequest = new LoginRequest();

  constructor(private integration: IntegrationService, private storage: LocalStorageService) {}

  login() {
    this.errorMessage = '';
    this.storage.remove('auth-key');

    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    const formValue = this.userForm.value;
    this.request.username = formValue.username;
    this.request.password = formValue.password;

    this.integration.doLogin(this.request).subscribe({
      next: (res) => {
        // store JWT
        this.storage.set('auth-key', res.token);

        // ✅ ADD THIS LINE (store user id)
        this.storage.set('userId', res.userId!.toString());

        // redirect
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.storage.remove('auth-key');
        if (err.status === 404) {
          this.errorMessage = 'Account does not exist. Please register.';
        } else if (err.status === 401) {
          this.errorMessage = 'Wrong username or password.';
        } else {
          this.errorMessage = 'Something went wrong. Try again later.';
        }
      }
    });
  }
}
