import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    const selectedRole = this.route.snapshot.queryParamMap.get('role');
  if (selectedRole) {
    localStorage.setItem('selected_role', selectedRole);
  }
  }

 onSubmit() {
  if (this.loginForm.invalid) return;

  this.authService.login(this.loginForm.value).subscribe({
    next: (res: any) => {
      const token = res.access_token;
      this.authService.saveToken(token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      localStorage.setItem('role', role);

      const selectedRole = localStorage.getItem('selected_role');

      // ❌ Role mismatch
      if (selectedRole && selectedRole !== role) {
        alert(`You are registered as ${role}, not ${selectedRole}`);
        this.authService.logout();
        return;
      }

      // ✅ Redirect
      if (role === 'coach') {
        this.router.navigate(['/coach-dashboard']);
      } else if (role === 'coachee') {
        this.router.navigate(['/coachee-dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    },
    error: () => {
      alert('Login failed');
    }
  });
}
}