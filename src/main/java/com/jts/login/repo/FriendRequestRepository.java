package com.jts.login.repo;

import com.jts.login.dto.FriendRequest;
import com.jts.login.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);

    List<FriendRequest> findByReceiverAndStatus(User receiver, FriendRequest.Status status);
}
