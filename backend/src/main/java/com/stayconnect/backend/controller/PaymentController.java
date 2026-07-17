package com.stayconnect.backend.controller;

import com.stayconnect.backend.model.Payment;
import com.stayconnect.backend.repository.BookingRepository;
import com.stayconnect.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping
    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getByBooking(@PathVariable String bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Payment> processPayment(@PathVariable String id, @RequestBody Payment statusContainer) {
        Optional<Payment> paymentOpt = paymentRepository.findById(id);
        if (paymentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Payment payment = paymentOpt.get();
        String newStatus = statusContainer.getStatus();
        payment.setStatus(newStatus);
        payment.setPaymentDate(Instant.now().toString());

        Payment saved = paymentRepository.save(payment);

        // If paid, confirm booking auto
        if ("Paid".equalsIgnoreCase(newStatus)) {
            bookingRepository.findById(payment.getBookingId()).ifPresent(b -> {
                b.setStatus("confirmed");
                bookingRepository.save(b);
            });
        }

        return ResponseEntity.ok(saved);
    }
}
