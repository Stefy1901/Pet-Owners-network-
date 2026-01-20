import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PetAlert } from '../../models/pet_alerts.model';
import { User } from '../../models/user.model';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-pet-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pet-alerts.component.html',
  styleUrls: ['./pet-alerts.component.css']
})
export class PetAlertsComponent {

  // logged-in user
  user: User | null = null;

  // alerts list
  alerts: PetAlert[] = [];

  // FORM FIELDS (these MUST exist because HTML uses them)
  description = '';
  lastLocation = '';
  contactEmail = '';
  contactPhone = '';
  reward = '';

  // image upload
  selectedImage?: File;
  previewImage?: string;

  private readonly BACKEND_URL = 'http://localhost:8080';

  constructor(private api: ApiService) {
    this.loadUser();
  }

  loadUser() {
    this.api.getCurrentUser().subscribe(user => {
      this.user = user;
      this.loadAlerts();
    });
  }

  loadAlerts() {
    this.api.getPetAlerts().subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => this.previewImage = reader.result as string;
    reader.readAsDataURL(file);
  }

  createAlert() {
    if (!this.description.trim() || !this.lastLocation.trim()) return;

    this.api.uploadPetAlert(
      this.description,
      this.lastLocation,
      this.contactEmail,
      this.contactPhone,
      this.reward,
      this.selectedImage
    ).subscribe(() => {
      // reset form
      this.description = '';
      this.lastLocation = '';
      this.contactEmail = '';
      this.contactPhone = '';
      this.reward = '';
      this.previewImage = undefined;
      this.selectedImage = undefined;
      this.loadAlerts();
    });
  }

  getFullImageUrl(path?: string) {
    return path ? this.BACKEND_URL + path : undefined;
  }

  deleteAlert(alertId: number | undefined) {
    if (!alertId) return; // safety check
    this.api.deletePetAlert(alertId).subscribe(() => {
      this.alerts = this.alerts.filter(a => a.id !== alertId);
    });
  }

}
