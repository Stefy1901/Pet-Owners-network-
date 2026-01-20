import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/post.model';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  posts: Post[] = [];
  newPostContent: string = '';

  constructor(private api: ApiService) {
    this.loadPosts();
  }

  loadPosts() {
    this.api.getAllPosts().subscribe({
      next: (data) => {
        // Sort by newest first
        this.posts = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (err) => console.error('Failed to load posts:', err)
    });
  }


  likePost(post: Post) {
    post.likes = post.likes ? post.likes + 1 : 1;
  }

  createPost() {
    if (!this.newPostContent.trim()) return;

    this.api.createPost({
      contentText: this.newPostContent
    }).subscribe({
      next: () => {
        this.newPostContent = '';
        this.loadPosts();
      },
      error: (err) => console.error('Failed to create post:', err)
    });
  }
  addFriend(userId: number) {
    this.api.addFriend(userId).subscribe();
  }


}
