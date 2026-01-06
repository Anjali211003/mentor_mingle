import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SessionService } from '../../services/session';
import { Auth } from '../../services/auth';
import { Session } from '../../models/session.model';

@Component({
  selector: 'app-sessions-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './sessions-page.html',
  styleUrls: ['./sessions-page.css']
})
export class SessionsPage implements OnInit {

  sessions: Session[] = [];
  loading = true;
  error = '';

  isCoachee = false;

  constructor(
    private sessionService: SessionService,
    private authService: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setRole();        // 🔥 FIX
    this.loadSessions();   // 🔥 FIX
    


  const user = JSON.parse(localStorage.getItem('users') || '{}');
  this.isCoachee = user.role === 'coachee';
}

  

  setRole(): void {
    const user = this.authService.getCurrentUser();

    console.log('Logged user:', user);   // 🔍 DEBUG

    this.isCoachee = user?.role === 'coachee';

    console.log('Is coachee:', this.isCoachee); // 🔍 DEBUG
  }

  loadSessions(): void {
    this.loading = true;

    this.sessionService.getAllSessions().subscribe({
      next: (res) => {
        this.sessions = res || [];
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 IMPORTANT
      },
      error: () => {
        this.error = 'Failed to load sessions';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  
request(sessionId: number): void {
  this.sessionService.requestSession(sessionId).subscribe({
    next: (updatedSession: Session) => {
      this.sessions = this.sessions.map(s =>
        s.id === updatedSession.id ? updatedSession : s
      );
      alert('Session requested successfully');
    },
    error: (err) => {
      alert(err?.error?.detail || 'Failed to request session');
    }
  });
}


loadMyRequestedSessions(): void {
  this.loading = true;

  this.sessionService.getMyRequestedSessions().subscribe({
    next: (res) => {
      this.sessions = res || [];
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}

}
