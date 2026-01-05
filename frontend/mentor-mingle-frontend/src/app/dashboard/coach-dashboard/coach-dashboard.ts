import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { SessionService } from '../../services/session';

@Component({
  selector: 'app-coach-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coach-dashboard.html',
  styleUrls: ['./coach-dashboard.css']
})
export class CoachDashboard implements OnInit {

  sessions: any[] = [];
  loading = true;
  error = '';
  menuOpen = false;

  coachName = '';   // 👈 NEW

  constructor(
    private sessionService: SessionService,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef   // 👈 IMPORTANT
  ) {}

  ngOnInit(): void {
    this.setCoachName();
    this.loadSessions();   // ✅ runs immediately
  }

  setCoachName(): void {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    this.coachName = user?.name || 'Coach';
  }

  loadSessions(): void {
    this.loading = true;

    this.sessionService.getMySessions().subscribe({
      next: (res) => {
        this.sessions = res;
        this.loading = false;
        this.cdr.detectChanges();   // 🔥 FIXES ISSUE 1
      },
      error: () => {
        this.error = 'Failed to load sessions';
        this.loading = false;
        this.cdr.detectChanges();   // 🔥 FIXES ISSUE 1
      }
    });
  }
  goSessions() {
  this.menuOpen = false;
  this.router.navigate(['/sessions']);
}

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  goProfile(): void {
    this.menuOpen = false;
    this.router.navigate(['/coach-profile']);
  }

  goCreateSession(): void {
    this.menuOpen = false;
    this.router.navigate(['/create-session']);
  }

  logout(): void {
    this.menuOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  editSession(sessionId: number): void {
  this.router.navigate(['/edit-session', sessionId]);
}

deleteSession(sessionId: number): void {
  if (!confirm('Are you sure you want to delete this session?')) return;

  this.sessionService.deleteSession(sessionId).subscribe({
    next: () => {
      this.sessions = this.sessions.filter(s => s.id !== sessionId);
    },
    error: () => {
      alert('Failed to delete session');
    }
  });
}
approve(sessionId: number) {
  this.sessionService.approveSession(sessionId).subscribe({
    next: (updated) => {
      this.updateSessionInUI(updated);
    },
    error: () => alert('Failed to approve session')
  });
}

reject(sessionId: number) {
  this.sessionService.rejectSession(sessionId).subscribe({
    next: (updated) => {
      this.updateSessionInUI(updated);
    },
    error: () => alert('Failed to reject session')
  });
}

private updateSessionInUI(updatedSession: any) {
  this.sessions = this.sessions.map(s =>
    s.id === updatedSession.id ? updatedSession : s
  );
}


}
