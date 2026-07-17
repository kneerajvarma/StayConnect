package com.stayconnect.backend.controller;

import com.stayconnect.backend.model.Customer;
import com.stayconnect.backend.model.User;
import com.stayconnect.backend.repository.CustomerRepository;
import com.stayconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        if (customer.getId() == null || customer.getId().isEmpty()) {
            customer.setId("u_" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (customer.getCreatedAt() == null || customer.getCreatedAt().isEmpty()) {
            customer.setCreatedAt(Instant.now().toString());
        }
        
        // Ensure corresponding user entity exists
        if (!userRepository.existsById(customer.getId())) {
            User newUser = User.builder()
                    .id(customer.getId())
                    .email(customer.getEmail())
                    .name(customer.getName())
                    .role("customer")
                    .mobile(customer.getMobile())
                    .address(customer.getAddress())
                    .gender(customer.getGender())
                    .status(customer.getStatus())
                    .avatar("https://api.dicebear.com/7.x/adventurer/svg?seed=" + customer.getName())
                    .build();
            userRepository.save(newUser);
        }
        
        return customerRepository.save(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(@PathVariable String id, @RequestBody Customer customer) {
        Optional<Customer> originalOpt = customerRepository.findById(id);
        if (originalOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Customer original = originalOpt.get();
        if (customer.getName() != null) original.setName(customer.getName());
        if (customer.getEmail() != null) original.setEmail(customer.getEmail());
        if (customer.getMobile() != null) original.setMobile(customer.getMobile());
        if (customer.getAddress() != null) original.setAddress(customer.getAddress());
        if (customer.getGender() != null) original.setGender(customer.getGender());
        if (customer.getStatus() != null) original.setStatus(customer.getStatus());
        
        // Sync corresponding user if present
        userRepository.findById(id).ifPresent(u -> {
            if (customer.getName() != null) u.setName(customer.getName());
            if (customer.getEmail() != null) u.setEmail(customer.getEmail());
            if (customer.getMobile() != null) u.setMobile(customer.getMobile());
            if (customer.getAddress() != null) u.setAddress(customer.getAddress());
            if (customer.getGender() != null) u.setGender(customer.getGender());
            if (customer.getStatus() != null) u.setStatus(customer.getStatus());
            userRepository.save(u);
        });

        return ResponseEntity.ok(customerRepository.save(original));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
