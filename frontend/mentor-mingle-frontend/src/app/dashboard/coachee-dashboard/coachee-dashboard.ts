import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { SessionService } from '../../services/session';

@Component({
  selector: 'app-coachee-dashboard',
  standalone: true,
  imports: [CommonModule,DatePipe],
  templateUrl: './coachee-dashboard.html',
  styleUrls: ['./coachee-dashboard.css']
})
export class CoacheeDashboard implements OnInit {

  sessions: any[] = [];   // 🔑 MUST be initialized
  loading = true;
  error = '';
  showMenu=false;
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

    this.sessionService.getMyRequestedSessions().subscribe({
      next: (res) => {
        this.sessions = res || [];
        this.loading = false;   // 🔑 STOP loading
      },
      error: () => {
        this.error = 'Failed to load sessions';
        this.loading = false;   // 🔑 STOP loading EVEN ON ERROR
      }
    });
  }
toggleMenu(): void {
  this.showMenu = !this.showMenu;
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/coachee-profile']);
  }
}
