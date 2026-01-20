package com.jts.login.dto;

public class UserDTO {
    private Integer id;
    private String username;
    private String bio;
    private String profilePictureUrl;
    private int friendsCount;

    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.bio = user.getBio();
        this.profilePictureUrl = user.getProfilePictureUrl();
        this.friendsCount = user.getFriends() != null ? user.getFriends().size() : 0;
    }

    // getters
    public Integer getId() { return id; }
    public String getUsername() { return username; }
    public String getBio() { return bio; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public int getFriendsCount() { return friendsCount; }
}
