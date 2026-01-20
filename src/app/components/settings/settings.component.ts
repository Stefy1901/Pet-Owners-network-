import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  user: User = {friends: [], username: '', email: '', mobileNo: '', city: '' };

  constructor(private api: ApiService) {
    this.loadUser();
  }

  loadUser() {
    this.api.getCurrentUser().subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Failed to load user:', err)
    });
  }

  saveSettings() {
    this.api.updateUserSettings(this.user).subscribe({
      next: () => alert('Settings updated successfully'),
      error: (err) => console.error('Failed to update settings:', err)
    });
  }
}
