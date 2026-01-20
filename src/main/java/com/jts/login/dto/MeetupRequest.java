package com.jts.login.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

public class MeetupRequest {

    private String title;
    private String location;
    private String animal;

    // frontend sends: "2025-12-28T15:30"
    private String dateTime;

    // getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAnimal() { return animal; }
    public void setAnimal(String animal) { this.animal = animal; }

    public String getDateTime() { return dateTime; }
    public void setDateTime(String dateTime) { this.dateTime = dateTime; }
}
