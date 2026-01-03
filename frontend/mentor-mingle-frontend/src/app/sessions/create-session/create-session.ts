import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session';

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-session.html',
  styleUrls: ['./create-session.css']
})
export class CreateSession {

  sessionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      topic: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1)]],
      time: ['', Validators.required],
      status: ['requested'],        // 🔒 fixed
      coachee_id: [null, Validators.required]
    });
  }

  submit() {
    if (this.sessionForm.invalid) return;

    this.sessionService.createSession(this.sessionForm.value).subscribe({
      next: () => {
        alert('Session created successfully');
        this.router.navigate(['/coach-dashboard']);
      },
      error: () => {
        alert('Failed to create session');
      }
    });
  }
}
