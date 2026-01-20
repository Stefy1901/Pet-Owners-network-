package com.jts.login.repo;

import com.jts.login.dto.PetAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetAlertRepository extends JpaRepository<PetAlert, Long> {
    List<PetAlert> findByCityOrderByCreatedAtDesc(String city);
}
