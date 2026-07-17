package com.stayconnect.backend.controller;

import com.stayconnect.backend.model.Review;
import com.stayconnect.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    @GetMapping("/homestay/{homestayId}")
    public List<Review> getByHomestay(@PathVariable String homestayId) {
        return reviewRepository.findByHomestayId(homestayId);
    }

    @PostMapping
    public Review create(@RequestBody Review review) {
        if (review.getId() == null || review.getId().isEmpty()) {
            review.setId("rev_" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (review.getDate() == null || review.getDate().isEmpty()) {
            review.setDate(Instant.now().toString().split("T")[0]);
        }
        return reviewRepository.save(review);
    }
}
