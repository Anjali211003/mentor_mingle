import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Profile } from '../../services/profile';

@Component({
  standalone: true,
  selector: 'app-coach-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-profile.html'
})
export class CoachProfile implements OnInit {

  profileForm!: FormGroup;

  profileLoaded = false;   // loading state
  hasProfile = false;      // profile exists or not
  errorMessage = '';

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
    this.profileService.getCoachProfile().subscribe({
      next: (res) => {
        this.profileForm.patchValue(res);
        this.hasProfile = true;
        this.profileLoaded = true;
      },
      error: (err) => {
        if (err.status === 404) {
          // Coach has NO profile yet
          this.hasProfile = false;
        } else {
          this.errorMessage = 'Failed to load profile';
        }

        this.profileLoaded = true; // 🔑 STOP LOADING
      }
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.profileService.updateCoachProfile(this.profileForm.value).subscribe({
      next: () => {
        alert('Profile saved successfully');
        this.hasProfile = true;
      },
      error: (err) => {
        if (err.status === 404) {
          alert('Profile does not exist. Creation is not enabled.');
        } else {
          alert('Failed to save profile');
        }
      }
    });
  }

  deleteProfile() {
    if (!confirm('Are you sure you want to delete your profile?')) return;

    this.profileService.deleteCoachProfile().subscribe({
      next: () => {
        alert('Profile deleted');
        this.profileForm.reset({
          availability: 'available'
        });
        this.hasProfile = false;
      },
      error: () => alert('Failed to delete profile')
    });
  }
}
