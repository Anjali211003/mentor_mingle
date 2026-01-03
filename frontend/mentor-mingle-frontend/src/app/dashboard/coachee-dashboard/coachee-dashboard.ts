import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-coachee-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './coachee-dashboard.html',
})
export class CoacheeDashboard {

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
