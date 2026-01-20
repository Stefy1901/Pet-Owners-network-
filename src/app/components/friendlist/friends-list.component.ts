import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-friends-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {

  friends: User[] = [];
  userId!: number;

  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.ngOnInit();
  }


  ngOnInit() {
    this.api.getFriends().subscribe(f => {
      this.friends = f;
    });
  }



  getFullImageUrl(path?: string) {
    return path ? 'http://localhost:8080' + path : 'assets/default-profile.png';
  }

  removeFriend(friendId: number | undefined) {
    console.log('Remove friend clicked:', friendId);

    this.api.removeFriend(friendId).subscribe({
      next: () => {
        this.friends = this.friends.filter(f => f.id !== friendId);
      },
      error: err => {
        console.error('Remove friend failed', err);
      }
    });
  }


}
