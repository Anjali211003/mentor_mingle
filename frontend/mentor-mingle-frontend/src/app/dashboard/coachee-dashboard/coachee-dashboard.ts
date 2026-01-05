import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { SessionService } from '../../services/session';

@Component({
  selector: 'app-coachee-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './coachee-dashboard.html',
  styleUrls: ['./coachee-dashboard.css']
})
export class CoacheeDashboard implements OnInit {

  sessions: any[] = [];
  loading = true;
  error = '';
  showMenu = false;
    menuOpen = false;
  coacheeName = '';   // 👈 OPTIONAL (same pattern as coach)

  constructor(
    private sessionService: SessionService,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef   // 🔥 IMPORTANT
  ) {}

  ngOnInit(): void {
    this.setCoacheeName();
    this.loadMySessions();   // ✅ auto-load on dashboard open
  }

  setCoacheeName(): void {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    this.coacheeName = user?.name || 'Coachee';
  }

  loadMySessions(): void {
    this.loading = true;

    this.sessionService.getMyRequestedSessions().subscribe({
      next: (res) => {
        this.sessions = res || [];
        this.loading = false;
        this.cdr.detectChanges();   // 🔥 FIXES LOADING ISSUE
      },
      error: () => {
        this.error = 'Failed to load sessions';
        this.loading = false;
        this.cdr.detectChanges();   // 🔥 REQUIRED
      }
    });
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  goSessions() {
  this.menuOpen = false;
  this.router.navigate(['/sessions']);
}


  goToProfile(): void {
    this.router.navigate(['/coachee-profile']);
  }
}
