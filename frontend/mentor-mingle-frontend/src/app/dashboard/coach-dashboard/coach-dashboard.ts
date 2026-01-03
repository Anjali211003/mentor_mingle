import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { SessionService } from '../../services/session';

@Component({
  selector: 'app-coach-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './coach-dashboard.html',
})
export class CoachDashboard implements OnInit {

  sessions: any[] = [];
  loading = true;      // 🔑 controls loader
  error = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.loadMySessions();
  }

  loadMySessions() {
    this.loading = true;

    this.sessionService.getMySessions().subscribe({
      next: (res) => {
        console.log('My sessions:', res);

        this.sessions = res || [];   // 🔑 handle empty array
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load sessions';
        this.loading = false;        // 🔥 MOST IMPORTANT LINE
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
