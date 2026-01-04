import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile } from '../../services/profile';

@Component({
  standalone: true,
  selector: 'app-coach-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-profile.html'
})
export class CoachProfile implements OnInit {

  profileForm!: FormGroup;   // ✅ declare only
  profileExists = false;

  constructor(
    private fb: FormBuilder,
    private profileService: Profile
  ) {}

  ngOnInit(): void {
    // ✅ initialize inside ngOnInit
    this.profileForm = this.fb.group({
      bio: ['', Validators.required],
      expertise: ['', Validators.required],
      location: ['', Validators.required],
      availability: ['available', Validators.required],
      image_url: ['']
    });

    // ✅ GET coachee profile
    this.profileService.getCoacheeProfile().subscribe({
      next: (res) => {
        this.profileForm.patchValue(res);
        this.profileExists = true;
      },
      error: () => {
        this.profileExists = false;
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    // ✅ POST or PUT based on existence
    const apiCall = this.profileExists
      ? this.profileService.updateCoacheeProfile(this.profileForm.value)
      : this.profileService.createCoacheeProfile(this.profileForm.value);

    apiCall.subscribe({
      next: () => {
        alert('Coachee profile saved successfully');
        this.profileExists = true;
      },
      error: () => {
        alert('Failed to save profile');
      }
    });
  }
}
