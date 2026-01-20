import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Meetup } from '../../models/meetup.model';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-meetups',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './meetups.component.html',
  styleUrls: ['./meetups.component.css']
})
export class MeetupsComponent {

  meetups: Meetup[] = [];

  newMeetup: Meetup = {
    title: '',
    location: '',
    animal: '',
    dateTime: ''
  };

  constructor(private api: ApiService) {
    this.loadMeetups();
  }

  loadMeetups() {
    this.api.getMeetups().subscribe(m => {
      this.meetups = m
        .filter(meetup => new Date(meetup.dateTime) > new Date()); // extra safety
    });
  }


  createMeetup() {
    const meetupRequest: Meetup = {
      title: this.newMeetup.title,
      location: this.newMeetup.location,
      animal: this.newMeetup.animal,
      dateTime: this.newMeetup.dateTime // already in "YYYY-MM-DDTHH:mm" from datetime-local
    };

    this.api.createMeetup(meetupRequest).subscribe(() => {
      this.newMeetup = { title: '', location: '', animal: '', dateTime: '' };
      this.loadMeetups();
    });
  }


  participate(id: number) {
    this.api.participate(id).subscribe(() => this.loadMeetups());
  }

  leave(id: number) {
    this.api.leaveMeetup(id).subscribe(() => this.loadMeetups());
  }
}
