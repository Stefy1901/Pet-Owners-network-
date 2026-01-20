package com.jts.login.dto;

import java.time.LocalDateTime;

public class PostDTO {
    private Long id;
    private String contentText;
    private String imageUrl;
    private LocalDateTime createdAt;
    private SimpleUserDTO user;  // only basic user info

    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public SimpleUserDTO getUser() { return user; }
    public void setUser(SimpleUserDTO user) { this.user = user; }

    // Inner class for minimal user info
    public static class SimpleUserDTO {
        private Integer id;
        private String username;
        private String profilePictureUrl;

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getProfilePictureUrl() { return profilePictureUrl; }
        public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    }
}
