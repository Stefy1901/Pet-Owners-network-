import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { UserDTO } from '../../models/user-dto.model';
import { PostDTO } from '../../models/post-dto.model';
import { FriendRequest } from '../../models/friendrequest';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user: UserDTO = { id: 0, username: '', bio: '', profilePictureUrl: '', friendsCount: 0 };
  posts: PostDTO[] = [];
  friends: UserDTO[] = [];
  friendRequests: FriendRequest[] = [];
  currentUserId!: number;


  selectedProfilePic?: File;
  previewProfilePic?: string;

  selectedPostImage?: File;
  previewPostImage?: string;

  newPost = { contentText: '' };

  isOwnProfile: boolean = false;
  isFriend: boolean = false;
  hasPendingRequest: boolean = false;
  friendRequestId?: number;

  private readonly BACKEND_BASE_URL = 'http://localhost:8080';

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadUser();
  }


  /** LOAD CURRENT OR OTHER USER PROFILE */
  loadUser() {
    const routeId = this.route.snapshot.paramMap.get('id');
    this.currentUserId = Number(localStorage.getItem('userId'));

    // CASE 1: /profile → own profile
    if (!routeId) {
      this.api.getCurrentUserDTO().subscribe(user => {
        this.user = user;
        this.isOwnProfile = true;

        this.loadPosts();
        this.loadFriends();
      });
      return;
    }

    // CASE 2: /profile/:id → other user's profile
    const profileId = Number(routeId);

    this.api.getUserByIdDTO(profileId).subscribe(user => {
      this.user = user;
      this.isOwnProfile = this.user.id === this.currentUserId;

      this.loadPosts(this.user.id);
      this.loadFriends();

      if (!this.isOwnProfile) {
        this.checkFriendStatus();
      }
    });
  }

  /** LOAD FRIENDS */
  loadFriends() {
    // you can convert friendsCount to dummy array for *ngFor if needed
    this.friends = Array.from({ length: this.user.friendsCount || 0 }, (_, i) => ({ id: i, username: `Friend ${i + 1}` } as UserDTO));
  }

  /** CHECK FRIEND STATUS FOR OTHER USERS */
  checkFriendStatus() {
    if (!this.user.id) return;

    this.api.getFriendStatus(this.user.id).subscribe(res => {
      this.isFriend = res.isFriend;
      this.hasPendingRequest = res.hasPendingRequest;
    });
  }


  /** LOAD POSTS (using PostDTO) */
  loadPosts(userId?: number) {
    if (userId) {
      this.api.getUserPostsDTO(userId).subscribe(posts => this.posts = posts);
    } else {
      this.api.getMyPostsDTO().subscribe(posts => this.posts = posts);
    }
  }

  /** CREATE NEW POST */
  createPost() {
    if (!this.newPost.contentText.trim()) return;

    const postData: any = { contentText: this.newPost.contentText };
    if (this.selectedPostImage) postData.imageFile = this.selectedPostImage;

    this.api.createPostDTO(postData).subscribe(() => {
      this.newPost.contentText = '';
      this.selectedPostImage = undefined;
      this.previewPostImage = undefined;
      this.loadPosts(this.isOwnProfile ? undefined : this.user.id);
    });
  }

  /** FRIEND REQUEST ACTIONS */
  addFriend() {
    if (!this.user.id) return;
    this.api.sendFriendRequest(this.user.id).subscribe(() => this.hasPendingRequest = true);
  }

  removeFriend() {
    if (!this.user.id) return;
    this.api.removeFriend(this.user.id).subscribe(() => this.isFriend = false);
  }

  acceptRequest(requestId: number) {
    this.api.acceptFriendRequest(requestId).subscribe(() => {
      this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);
      this.loadFriends();
    });
  }

  declineRequest(requestId: number) {
    this.api.declineFriendRequest(requestId).subscribe(() => {
      this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);
    });
  }

  /** LOAD FRIEND REQUESTS */
  loadFriendRequests() {
    this.api.getFriendRequests().subscribe(requests => this.friendRequests = requests);
  }

  /** PROFILE PICTURE UPLOAD */
  onProfilePicSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.selectedProfilePic = file;

    const reader = new FileReader();
    reader.onload = () => this.previewProfilePic = reader.result as string;
    reader.readAsDataURL(file);
  }

  uploadProfilePicture() {
    if (!this.selectedProfilePic) return;

    this.api.uploadImage(this.selectedProfilePic).subscribe(url => {
      // convert UserDTO -> User to send to backend
      const updatedUser: User = {
        id: this.user.id,
        username: this.user.username,
        bio: this.user.bio,
        profilePictureUrl: url,
        friends: [] // required field
      };
      this.api.updateUser(updatedUser).subscribe(() => {
        this.user.profilePictureUrl = url;
        this.previewProfilePic = undefined;
      });
    });
  }

  saveBio() {
    if (!this.user.id) return;
    const updatedUser: User = {
      id: this.user.id,
      username: this.user.username,
      bio: this.user.bio,
      profilePictureUrl: this.user.profilePictureUrl,
      friends: [] // required field
    };
    this.api.updateUser(updatedUser).subscribe();
  }

  /** POST IMAGE UPLOAD */
  onPostImageSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    this.selectedPostImage = file;

    const reader = new FileReader();
    reader.onload = () => this.previewPostImage = reader.result as string;
    reader.readAsDataURL(file);
  }

  /** HELPER */
  getFullImageUrl(relativePath?: string): string | undefined {
    return relativePath ? this.BACKEND_BASE_URL + relativePath : undefined;
  }

  /** LIKE POST (frontend only) */
  likePost(post: PostDTO) {
    post.likes = (post.likes || 0) + 1;
  }
}
