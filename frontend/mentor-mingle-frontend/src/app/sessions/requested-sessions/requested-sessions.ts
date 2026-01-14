
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session';
import { SessionRequest } from '../../models/session-requests.model';
import { CommonModule, DatePipe } from '@angular/common';


@Component({
  selector: 'app-requested-sessions',
  imports: [CommonModule,DatePipe],
  templateUrl: './requested-sessions.html',
  styleUrls: ['./requested-sessions.css']
})
export class RequestedSessions implements OnInit {

  requests: SessionRequest[] = [];
  loading = true;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getRequestedSessionsForCoach().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: () => {
        alert('Failed to load requested sessions');
        this.loading = false;
      }
    });
  }
}
