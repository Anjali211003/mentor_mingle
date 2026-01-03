import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Profile } from '../../services/profile';
import { finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-coach-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-profile.html'
})
export class CoachProfile implements OnInit {

  profileForm!: FormGroup;
  profileLoaded = false;
  hasProfile = false;

  constructor(
    private fb: FormBuilder,
    private profileService: Profile
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      bio: ['', Validators.required],
      expertise: ['', Validators.required],
      location: ['', Validators.required],
      availability: ['available', Validators.required],
      image_url: ['']
    });
  }

  loadProfile() {
    this.profileService.getCoachProfile()
      .pipe(
        finalize(() => {
          // 🔥 THIS FIXES INFINITE LOADING
          this.profileLoaded = true;
        })
      )
      .subscribe({
        next: (profile) => {
          console.log('Profile loaded:', profile);
          this.profileForm.patchValue(profile);
          this.hasProfile = true;
        },
        error: (err) => {
          if (err.status === 404) {
            this.hasProfile = false;
          } else {
            console.error('Profile load error:', err);
          }
        }
      });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.profileService.updateCoachProfile(this.profileForm.value).subscribe({
      next: () => {
        alert(this.hasProfile ? 'Profile updated' : 'Profile created');
        this.hasProfile = true;
      },
      error: (err) => {
        alert(err.error?.detail || 'Failed to save profile');
      }
    });
  }

  deleteProfile() {
    if (!confirm('Are you sure you want to delete your profile?')) return;

    this.profileService.deleteCoachProfile().subscribe({
      next: () => {
        alert('Profile deleted');
        this.profileForm.reset({ availability: 'available' });
        this.hasProfile = false;
      },
      error: (err) => {
        alert(err.error?.detail || 'Failed to delete profile');
      }
    });
  }
}
