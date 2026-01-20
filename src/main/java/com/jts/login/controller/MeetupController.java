package com.jts.login.controller;

import com.jts.login.dto.Meetup;
import com.jts.login.dto.MeetupRequest;
import com.jts.login.dto.User;
import com.jts.login.repo.MeetupRepository;
import com.jts.login.repo.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/meetups")
public class MeetupController {

    private final MeetupRepository meetupRepo;
    private final UserRepository userRepo;

    public MeetupController(MeetupRepository meetupRepo, UserRepository userRepo) {
        this.meetupRepo = meetupRepo;
        this.userRepo = userRepo;
    }

    @PostMapping
    public Meetup createMeetup(@RequestBody MeetupRequest request, Authentication auth) {

        if (request.getDateTime() == null || request.getDateTime().isBlank()) {
            throw new IllegalArgumentException("Date/time is required");
        }

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

        LocalDateTime dt =
                LocalDateTime.parse(request.getDateTime(), formatter);

        User user = userRepo.findByUsername(auth.getName()).orElseThrow();

        Meetup meetup = new Meetup();
        meetup.setTitle(request.getTitle());
        meetup.setLocation(request.getLocation());
        meetup.setAnimal(request.getAnimal());
        meetup.setDateTime(dt);
        meetup.setCreator(user);

        return meetupRepo.save(meetup);
    }



    @GetMapping
    public List<Meetup> getAll() {
        LocalDateTime now = LocalDateTime.now();
        return meetupRepo.findAll().stream()
                .filter(m -> m.getDateTime() != null && m.getDateTime().isAfter(now))
                .toList();

    }


    // Participate
    @PostMapping("/{id}/participate")
    public Meetup participate(@PathVariable Long id, Authentication auth) {
        Meetup meetup = meetupRepo.findById(id).orElseThrow();
        User user = userRepo.findByUsername(auth.getName()).orElseThrow();

        if (!meetup.getParticipants().contains(user)) {
            meetup.getParticipants().add(user);
        }

        return meetupRepo.save(meetup);
    }

    // Leave
    @PostMapping("/{id}/leave")
    public Meetup leave(@PathVariable Long id, Authentication auth) {
        Meetup meetup = meetupRepo.findById(id).orElseThrow();
        User user = userRepo.findByUsername(auth.getName()).orElseThrow();

        meetup.getParticipants().remove(user);
        return meetupRepo.save(meetup);
    }
}
