package com.stayconnect.backend.controller;

import com.stayconnect.backend.model.Customer;
import com.stayconnect.backend.model.User;
import com.stayconnect.backend.repository.CustomerRepository;
import com.stayconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String mobile;
        private String address;
        private String gender;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        
        if (!email.contains("@") && (email.equals("admin") || email.matches("admin\\d+"))) {
            email = email + "@stayconnect.com";
        }

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }

        // On-the-fly user registration if not found (matches frontend mock behavior)
        String cleanName = request.getEmail().trim();
        String finalEmail = email;
        if (cleanName.contains("@")) {
            cleanName = cleanName.split("@")[0];
        }
        cleanName = cleanName.substring(0, 1).toUpperCase() + cleanName.substring(1);

        String role = "customer";
        String usernamePart = finalEmail.split("@")[0];
        if (usernamePart.equals("admin") || usernamePart.matches("admin\\d+")) {
            role = "admin";
        }

        String userId = "u_" + UUID.randomUUID().toString().substring(0, 8);
        User newUser = User.builder()
                .id(userId)
                .email(finalEmail)
                .name(cleanName)
                .role(role)
                .mobile("+1 (555) 000-0000")
                .address("Default Address")
                .gender("Male")
                .status("active")
                .avatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80")
                .build();

        userRepository.save(newUser);

        if ("customer".equals(role)) {
            Customer newCustomer = Customer.builder()
                    .id(userId)
                    .name(cleanName)
                    .email(finalEmail)
                    .mobile("+1 (555) 000-0000")
                    .address("Default Address")
                    .gender("Male")
                    .status("active")
                    .createdAt(Instant.now().toString())
                    .build();
            customerRepository.save(newCustomer);
        }

        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with this email already exists");
        }

        String userId = "u_" + UUID.randomUUID().toString().substring(0, 8);
        User newUser = User.builder()
                .id(userId)
                .email(email)
                .name(request.getName())
                .role("customer")
                .mobile(request.getMobile())
                .address(request.getAddress())
                .gender(request.getGender())
                .status("active")
                .avatar("https://api.dicebear.com/7.x/adventurer/svg?seed=" + request.getName())
                .build();

        Customer newCustomer = Customer.builder()
                .id(userId)
                .name(request.getName())
                .email(email)
                .mobile(request.getMobile())
                .address(request.getAddress())
                .gender(request.getGender())
                .status("active")
                .createdAt(Instant.now().toString())
                .build();

        userRepository.save(newUser);
        customerRepository.save(newCustomer);

        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }
}
