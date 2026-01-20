package com.jts.login.repo;

import com.jts.login.dto.Post;
import com.jts.login.dto.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByUserOrderByCreatedAtDesc(User user);

    List<Post> findByUserIdOrderByCreatedAtDesc(long longValue);



}

