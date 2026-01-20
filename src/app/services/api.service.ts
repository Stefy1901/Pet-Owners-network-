import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import {CreatePostRequest} from "../models/create-post.dto";
import {Meetup} from "../models/meetup.model";
import {PetAlert} from "../models/pet_alerts.model";
import {FriendRequest} from "../models/friendrequest";
import {PostDTO} from "../models/post-dto.model";
import {UserDTO} from "../models/user-dto.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Upload image (profile or post)
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<string>(`${this.base}/files/upload`, formData);
  }

  // Get current logged-in user
  getCurrentUser() {
    return this.http.get<User>(`${this.base}/users/me`);
  }

  // Update user bio or profile picture
  updateUser(user: User) {
    return this.http.put<User>(`${this.base}/users/update`, user);
  }

  // Create a new post
  createPost(post: CreatePostRequest) {
    return this.http.post<Post>(`${this.base}/posts`, post);
  }

  // Get posts of current user
  getUserPosts() {
    return this.http.get<Post[]>(`${this.base}/posts/me`);
  }

  // Get all posts (dashboard)
  getAllPosts() {
    return this.http.get<Post[]>(`${this.base}/posts`);
  }
  // Meetups
  getMeetups() {
    return this.http.get<Meetup[]>(`${this.base}/meetups`);
  }

  createMeetup(meetup: Meetup) {
    return this.http.post<Meetup>(`${this.base}/meetups`, meetup);
  }

  participate(meetupId: number) {
    return this.http.post(`${this.base}/meetups/${meetupId}/participate`, {});
  }

  leaveMeetup(meetupId: number) {
    return this.http.post(`${this.base}/meetups/${meetupId}/leave`, {});
  }
  updateUserSettings(user: User) {
    return this.http.put<User>(`${this.base}/users/settings`, user);
  }
  uploadPetAlert(
    description: string,
    lastLocation: string,
    contactEmail: string,
    contactPhone: string,
    reward: string,
    file?: File
  ) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('lastLocation', lastLocation);
    formData.append('contactEmail', contactEmail);
    formData.append('contactPhone', contactPhone);
    formData.append('reward', reward);

    if (file) {
      formData.append('file', file);
    }

    return this.http.post<PetAlert>(`${this.base}/pet-alerts/upload`, formData);
  }


// Get alerts for user's city
  getPetAlerts() {
    return this.http.get<PetAlert[]>(`${this.base}/pet-alerts`);
  }

  deletePetAlert(id: number) {
    return this.http.delete(`${this.base}/pet-alerts/${id}`);
  }


  // --- FRIEND SYSTEM ---

  getFriendRequests() {
    return this.http.get<FriendRequest[]>(`${this.base}/friends/requests`);
  }

  sendFriendRequest(userId: number) {
    return this.http.post(`${this.base}/friends/request/${userId}`, {});
  }

  acceptFriendRequest(id: number) {
    return this.http.post(`${this.base}/friends/accept/${id}`, {});
  }

  declineFriendRequest(id: number) {
    return this.http.post(`${this.base}/friends/decline/${id}`, {});
  }

  removeFriend(friendId: number | undefined) {
    return this.http.delete(`${this.base}/friends/remove/${friendId}`);
  }
  getUserPostsByIdDTO(userId: number) {
    return this.http.get<Post[]>(`${this.base}/posts/user/${userId}`);
  }
  // ApiService.ts (only relevant parts)
  getCurrentUserDTO() {
    return this.http.get<UserDTO>(`${this.base}/users/me`);
  }

  getUserByIdDTO(id: number) {
    return this.http.get<UserDTO>(`${this.base}/users/dto/${id}`);
  }
  getCurrentUserAsUser() {
    return this.http.get<User>(`${this.base}/users/me/full`);
  }
  getUserFriendsDTO(userId: number) {
    return this.http.get<UserDTO[]>(`${this.base}/users/${userId}/friends`);
  }

  getMyPostsDTO() {
    return this.http.get<PostDTO[]>(`${this.base}/posts/me`);
  }

  getUserPostsDTO(userId: number) {
    return this.http.get<PostDTO[]>(`${this.base}/posts/user/${userId}`);
  }

  getAllPostsDTO() {
    return this.http.get<PostDTO[]>(`${this.base}/posts`);
  }

  createPostDTO(post: { contentText: string; imageUrl?: string }) {
    return this.http.post<PostDTO>(`${this.base}/posts`, post);
  }

  addFriend(userId: number) {
    return this.http.post(`${this.base}/friends/request/${userId}`, {});
  }

  getFriendStatus(userId: number | undefined) {
    return this.http.get<any>(`${this.base}/friends/status/${userId}`);
  }

  acceptFriend(id: number) {
    return this.http.post(`${this.base}/friends/accept/${id}`, {});
  }

  denyFriend(id: number) {
    return this.http.delete(`${this.base}/friends/decline/${id}`);
  }

  getFriends() {
    return this.http.get<any[]>(`${this.base}/friends/list`);
  }

}
