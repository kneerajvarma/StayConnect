package com.stayconnect.backend.controller;

import com.stayconnect.backend.model.Booking;
import com.stayconnect.backend.model.Payment;
import com.stayconnect.backend.repository.BookingRepository;
import com.stayconnect.backend.repository.PaymentRepository;
import com.stayconnect.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping
    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable String id) {
        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Booking> getByCustomer(@PathVariable String customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    @PostMapping
    public Booking create(@RequestBody Booking booking) {
        if (booking.getId() == null || booking.getId().isEmpty()) {
            booking.setId("b_" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (booking.getBookingDate() == null || booking.getBookingDate().isEmpty()) {
            booking.setBookingDate(Instant.now().toString());
        }
        booking.setStatus("pending");

        // Save booking
        Booking saved = bookingRepository.save(booking);

        // Update room availability to false
        roomRepository.findById(booking.getRoomId()).ifPresent(r -> {
            r.setAvailability(false);
            roomRepository.save(r);
        });

        // Auto-create pending payment
        String paymentId = "p_" + UUID.randomUUID().toString().substring(0, 8);
        Payment newPayment = Payment.builder()
                .id(paymentId)
                .bookingId(saved.getId())
                .amount(saved.getAmount())
                .paymentMethod("UPI")
                .status("Pending")
                .paymentDate(Instant.now().toString())
                .build();
        paymentRepository.save(newPayment);

        return saved;
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(@PathVariable String id, @RequestBody Booking statusContainer) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Booking booking = bookingOpt.get();
        String newStatus = statusContainer.getStatus();
        booking.setStatus(newStatus);

        if ("cancelled".equalsIgnoreCase(newStatus)) {
            // Set room back to available
            roomRepository.findById(booking.getRoomId()).ifPresent(r -> {
                r.setAvailability(true);
                roomRepository.save(r);
            });
            // Fail associated payment
            paymentRepository.findByBookingId(id).ifPresent(p -> {
                p.setStatus("Failed");
                paymentRepository.save(p);
            });
        } else if ("completed".equalsIgnoreCase(newStatus)) {
            // Set room back to available
            roomRepository.findById(booking.getRoomId()).ifPresent(r -> {
                r.setAvailability(true);
                roomRepository.save(r);
            });
            // Mark payment as paid
            paymentRepository.findByBookingId(id).ifPresent(p -> {
                p.setStatus("Paid");
                paymentRepository.save(p);
            });
        }

        return ResponseEntity.ok(bookingRepository.save(booking));
    }
}
