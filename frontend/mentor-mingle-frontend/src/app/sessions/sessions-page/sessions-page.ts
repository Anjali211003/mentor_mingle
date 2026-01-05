import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SessionService } from '../../services/session';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sessions-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './sessions-page.html',
  styleUrls: ['./sessions-page.css']
})
export class SessionsPage implements OnInit {

  sessions: any[] = [];
  loading = true;
  error = '';

  isCoachee = false;

  constructor(
    private sessionService: SessionService,
    private authService: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.detectRole();
    this.loadSessions();
  }

  detectRole(): void {
    // 🔥 SAFE ROLE DETECTION
    const stored =
      localStorage.getItem('users') ||
      localStorage.getItem('user') ||
      localStorage.getItem('currentUser');

    if (stored) {
      const user = JSON.parse(stored);
      this.isCoachee = user?.role === 'coachee';
    }

    console.log('Is Coachee:', this.isCoachee); // ✅ DEBUG
  }

  loadSessions(): void {
    this.loading = true;

    this.sessionService.getAllSessions().subscribe({
      next: (res) => {
        this.sessions = res || [];
        this.loading = false;
        this.cdr.detectChanges();   // 🔥 FIX
      },
      error: () => {
        this.error = 'Failed to load sessions';
        this.loading = false;
        this.cdr.detectChanges();   // 🔥 FIX
      }
    });
  }

  request(sessionId: number): void {
    this.sessionService.requestSession(sessionId).subscribe({
      next: () => alert('Session requested'),
      error: () => alert('Failed to request session')
    });
  }
}
