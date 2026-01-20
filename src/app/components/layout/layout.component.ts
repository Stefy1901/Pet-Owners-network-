import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FriendRequest } from '../../models/friendrequest';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  friendRequests: any[] = [];

  constructor(
    private api: ApiService,
    public router: Router   // ✅ REQUIRED for template
  ) {
    this.loadFriendRequests();
  }

  ngOnInit() {
    this.api.getFriendRequests().subscribe(reqs => {
      this.friendRequests = reqs;
    });
  }

  loadFriendRequests() {
    this.api.getFriendRequests().subscribe({
      next: (requests) => this.friendRequests = requests,
      error: (err) => console.error('Failed to load friend requests', err)
    });
  }

  acceptRequest(id: number) {
    this.api.acceptFriend(id).subscribe(() => {
      this.friendRequests = this.friendRequests.filter(r => r.id !== id);
    });
  }

  declineRequest(id: number) {
    this.api.denyFriend(id).subscribe(() => {
      this.friendRequests = this.friendRequests.filter(r => r.id !== id);
    });
  }

  logout() {
    localStorage.removeItem('auth-key');
    window.location.href = '/login';
  }
}
