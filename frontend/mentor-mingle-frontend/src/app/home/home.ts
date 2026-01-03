import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  constructor(private router: Router) {}

  login(role: 'coach' | 'coachee') {
    this.router.navigate(['/login'], {
      queryParams: { role }
    });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
