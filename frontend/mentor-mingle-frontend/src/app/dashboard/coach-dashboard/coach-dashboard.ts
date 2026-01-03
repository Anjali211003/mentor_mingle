import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-coach-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './coach-dashboard.html',
})
export class CoachDashboard {

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
