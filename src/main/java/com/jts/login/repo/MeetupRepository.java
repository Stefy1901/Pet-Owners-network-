package com.jts.login.repo;

import com.jts.login.dto.Meetup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetupRepository extends JpaRepository<Meetup, Long> {
}
