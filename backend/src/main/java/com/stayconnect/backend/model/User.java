package com.stayconnect.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    private String id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String name;
    private String role; // "admin" | "customer"
    private String mobile;
    private String address;
    private String gender;
    private String status; // "active" | "inactive"
    private String avatar;

    public User() {}

    public User(String id, String email, String name, String role, String mobile, String address, String gender, String status, String avatar) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.mobile = mobile;
        this.address = address;
        this.gender = gender;
        this.status = status;
        this.avatar = avatar;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String email;
        private String name;
        private String role;
        private String mobile;
        private String address;
        private String gender;
        private String status;
        private String avatar;

        public Builder id(String id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder mobile(String mobile) { this.mobile = mobile; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder gender(String gender) { this.gender = gender; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder avatar(String avatar) { this.avatar = avatar; return this; }

        public User build() {
            return new User(id, email, name, role, mobile, address, gender, status, avatar);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
}
