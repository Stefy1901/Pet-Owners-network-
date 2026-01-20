package com.jts.login.controller;

import com.jts.login.dto.FriendRequest;
import com.jts.login.dto.User;
import com.jts.login.dto.UserDTO;
import com.jts.login.repo.FriendRequestRepository;
import com.jts.login.repo.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    private final UserRepository userRepo;
    private final FriendRequestRepository requestRepo;

    public FriendController(UserRepository userRepo, FriendRequestRepository requestRepo) {
        this.userRepo = userRepo;
        this.requestRepo = requestRepo;
    }

    // SEND FRIEND REQUEST
    @PostMapping("/request/{userId}")
    public void sendRequest(@PathVariable Long userId, Authentication auth) {
        User sender = userRepo.findByUsername(auth.getName()).orElseThrow();
        User receiver = userRepo.findById(userId).orElseThrow();

        if (sender.equals(receiver)) return;
        if (sender.getFriends().contains(receiver)) return;
        if (requestRepo.findBySenderAndReceiver(sender, receiver).isPresent()) return;

        FriendRequest req = new FriendRequest();
        req.setSender(sender);
        req.setReceiver(receiver);
        req.setStatus(FriendRequest.Status.PENDING);

        requestRepo.save(req);
    }

    // ACCEPT REQUEST
    @PostMapping("/accept/{id}")
    public void accept(@PathVariable Long id) {
        FriendRequest req = requestRepo.findById(id).orElseThrow();

        User a = req.getSender();
        User b = req.getReceiver();

        a.getFriends().add(b);
        b.getFriends().add(a);

        userRepo.save(a);
        userRepo.save(b);

        requestRepo.delete(req);
    }


    // DECLINE REQUEST
    @DeleteMapping("/decline/{id}")
    public void decline(@PathVariable Long id) {
        requestRepo.deleteById(id);
    }


    // GET MY PENDING REQUESTS (FOR NOTIFICATIONS)
    @GetMapping("/friends")
    public Set<UserDTO> getFriends(Authentication authentication) {
        User user = userRepo.findByUsername(authentication.getName()).orElseThrow();
        return user.getFriends().stream()
                .map(UserDTO::new)
                .collect(Collectors.toSet());
    }


    // REMOVE FRIEND
    @DeleteMapping("/remove/{userId}")
    public void remove(@PathVariable Long userId, Authentication auth) {
        User me = userRepo.findByUsername(auth.getName()).orElseThrow();
        User other = userRepo.findById(userId).orElseThrow();

        me.getFriends().remove(other);
        other.getFriends().remove(me);

        userRepo.save(me);
        userRepo.save(other);
    }

    @GetMapping("/is-friend/{userId}")
    public boolean isFriend(@PathVariable Long userId, Authentication auth) {
        User me = userRepo
                .findByUsername(auth.getName())
                .orElseThrow();

        return me.getFriends()
                .stream()
                .anyMatch(u -> u.getId().equals(userId));
    }
    @GetMapping("/status/{userId}")
    public Map<String, Boolean> getStatus(@PathVariable Long userId, Authentication auth) {
        User me = userRepo.findByUsername(auth.getName()).orElseThrow();
        User other = userRepo.findById(userId).orElseThrow();

        boolean isFriend = me.getFriends().contains(other);
        boolean hasPendingRequest =
                requestRepo.findBySenderAndReceiver(me, other).isPresent();

        return Map.of(
                "isFriend", isFriend,
                "hasPendingRequest", hasPendingRequest
        );


    }
    @GetMapping("/requests")
    public List<FriendRequest> getRequests(Authentication auth) {
        User me = userRepo.findByUsername(auth.getName()).orElseThrow();
        return requestRepo.findByReceiverAndStatus(
                me, FriendRequest.Status.PENDING
        );
    }
    @GetMapping("/list")
    public Set<User> list(Authentication auth) {
        return userRepo
                .findByUsername(auth.getName())
                .orElseThrow()
                .getFriends();
    }


}
