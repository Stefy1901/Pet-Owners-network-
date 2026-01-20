package com.jts.login.controller;

import com.jts.login.dto.Post;
import com.jts.login.dto.PostDTO;
import com.jts.login.dto.User;
import com.jts.login.repo.PostRepository;
import com.jts.login.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Post createPost(@RequestBody Post post, Authentication auth) {
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    /*@GetMapping
    public List<Post> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/me")
    public List<Post> getMyPosts(Authentication auth) {
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return postRepository.findByUserOrderByCreatedAtDesc(user);
    }
    @GetMapping("/user/{id}")
    public List<Post> getUserPostsById(@PathVariable Integer id) {
        User user = userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("User not found"));
        return postRepository.findByUserOrderByCreatedAtDesc(user);
    }*/
    private PostDTO toDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setContentText(post.getContentText());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());

        PostDTO.SimpleUserDTO userDto = new PostDTO.SimpleUserDTO();
        userDto.setId(post.getUser().getId());
        userDto.setUsername(post.getUser().getUsername());
        userDto.setProfilePictureUrl(post.getUser().getProfilePictureUrl());
        dto.setUser(userDto);

        return dto;
    }
    @GetMapping("/me")
    public List<PostDTO> getMyPosts(Authentication auth) {
        String username = auth.getName();
        User me = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return postRepository.findByUserOrderByCreatedAtDesc(me)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @GetMapping("/user/{id}")
    public List<PostDTO> getUserPostsById(@PathVariable Integer id) {
        User user = userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("User not found"));

        return postRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @GetMapping
    public List<PostDTO> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .toList();
    }


}
