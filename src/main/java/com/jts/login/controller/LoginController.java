package com.jts.login.controller;
import com.jts.login.dto.User;

import com.jts.login.repo.UserRepository;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.jts.login.config.JWTService;
import com.jts.login.dto.LoginRequest;
import com.jts.login.dto.LoginResponse;
import com.jts.login.dto.SignupRequest;
import com.jts.login.dto.SignupResponse;
import com.jts.login.service.LoginService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JWTService jwtService;

	@Autowired
	private LoginService loginService;
	@Autowired
	private UserRepository userRepository;


	@PostMapping("/doLogin")
	public ResponseEntity<?> doLogin(@RequestBody LoginRequest request) {

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							request.getUsername(),
							request.getPassword()
					)
			);
		}
		catch (UsernameNotFoundException e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("USER_NOT_FOUND");
		}
		catch (BadCredentialsException e) {
			return ResponseEntity
					.status(HttpStatus.UNAUTHORIZED)
					.body("WRONG_PASSWORD");
		}

		// ✅ success
		String token = jwtService.generateToken(request.getUsername());
		LoginResponse response = new LoginResponse();
		response.setToken(token);

		User user = userRepository
				.findByUsername(request.getUsername())
				.orElseThrow();


		response.setUserId(user.getId().longValue());




		return ResponseEntity.ok(response);
	}

	@PostMapping("/doRegister")
	public ResponseEntity<SignupResponse> doRegister(@RequestBody SignupRequest request) {
		return new ResponseEntity<>(loginService.doRegister(request), HttpStatus.CREATED);
	}
}
