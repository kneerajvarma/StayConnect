package com.stayconnect.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    private String id;
    
    private String name;
    private String email;
    private String mobile;
    private String address;
    private String gender; // "Male" | "Female" | "Other"
    private String status; // "active" | "inactive"
    private String createdAt;

    public Customer() {}

    public Customer(String id, String name, String email, String mobile, String address, String gender, String status, String createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.address = address;
        this.gender = gender;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String email;
        private String mobile;
        private String address;
        private String gender;
        private String status;
        private String createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder mobile(String mobile) { this.mobile = mobile; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder gender(String gender) { this.gender = gender; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public Customer build() {
            return new Customer(id, name, email, mobile, address, gender, status, createdAt);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
