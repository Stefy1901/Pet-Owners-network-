package com.jts.login.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:4200")
public class FileController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    // ✅ Only authenticated users can upload
    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        File folder = new File(uploadDir);
        if (!folder.exists()) folder.mkdirs();

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir, filename);
        Files.write(path, file.getBytes());

        // Return URL relative to backend so Angular can fetch
        String fileUrl = "/api/files/" + filename;
        return ResponseEntity.ok(fileUrl);
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws MalformedURLException {
        Path path = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) return ResponseEntity.notFound().build();

        String contentType = "application/octet-stream";
        try {
            contentType = Files.probeContentType(path);
        } catch (IOException ignored) {}

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
