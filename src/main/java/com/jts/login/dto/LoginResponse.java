package com.jts.login.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

	private String token;
	private Long userId;   // ✅ ADD THIS

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	// ✅ ADD THESE
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}
}

