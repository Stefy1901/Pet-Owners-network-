package com.jts.login.controller;

import com.jts.login.dto.PetAlert;
import com.jts.login.dto.User;
import com.jts.login.repo.PetAlertRepository;
import com.jts.login.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pet-alerts")
@CrossOrigin(origins = "http://localhost:4200")
public class PetAlertController {

    @Autowired
    private PetAlertRepository petAlertRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Upload new alert with optional image
    @PostMapping("/upload")
    public ResponseEntity<PetAlert> createPetAlert(
            @RequestParam("description") String description,
            @RequestParam("lastLocation") String lastLocation,
            @RequestParam("contactEmail") String contactEmail,
            @RequestParam("contactPhone") String contactPhone,
            @RequestParam(value = "reward", required = false) Double reward,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication auth
    ) throws IOException {

        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PetAlert alert = new PetAlert();
        alert.setDescription(description);
        alert.setLastLocation(lastLocation);
        alert.setContactEmail(contactEmail);
        alert.setContactPhone(contactPhone);
        alert.setReward(reward);
        alert.setUser(user);
        alert.setCity(user.getCity());
        alert.setCreatedAt(LocalDateTime.now());

        if (file != null && !file.isEmpty()) {
            File folder = new File(uploadDir);
            if (!folder.exists()) folder.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir, filename);
            Files.write(path, file.getBytes());

            alert.setImageUrl("/api/files/" + filename);
        }

        return ResponseEntity.ok(petAlertRepository.save(alert));
    }


    @GetMapping
    public List<PetAlert> getPetAlerts(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return petAlertRepository.findByCityOrderByCreatedAtDesc(user.getCity());
    }
    @DeleteMapping("/{id}")
    public void deleteAlert(@PathVariable Long id, Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        PetAlert alert = petAlertRepository.findById(id).orElseThrow();

        if (!alert.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        petAlertRepository.delete(alert);
    }

}

