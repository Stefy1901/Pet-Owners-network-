package com.jts.login.controller;

import com.jts.login.dto.User;
import com.jts.login.dto.UserDTO;
import com.jts.login.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // =====================
    // CURRENT USER
    // =====================

    @GetMapping("/me")
    public UserDTO getCurrentUser(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user);
    }

    // =====================
    // USER BY ID (DTO)
    // =====================
    @GetMapping("/dto/{id}")
    public UserDTO getUserDTOById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user);
    }

    // =====================
    // USER BY ID (FULL ENTITY)
    // =====================
    @GetMapping("/full/{id}")
    public ResponseEntity<User> getUserFullById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // =====================
    // USER FRIENDS
    // =====================
    @GetMapping("/{id}/friends")
    public ResponseEntity<Set<User>> getUserFriends(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getFriends());
    }

    // =====================
    // UPDATE BIO / PROFILE PICTURE
    // =====================
    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User updatedUser, Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getBio() != null) user.setBio(updatedUser.getBio());
        if (updatedUser.getProfilePictureUrl() != null)
            user.setProfilePictureUrl(updatedUser.getProfilePictureUrl());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    // =====================
    // UPDATE OTHER SETTINGS
    // =====================
    @PutMapping("/settings")
    public ResponseEntity<User> updateSettings(@RequestBody User updatedUser, Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
        if (updatedUser.getMobileNo() != null) user.setMobileNo(updatedUser.getMobileNo());
        if (updatedUser.getCity() != null) user.setCity(updatedUser.getCity());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
