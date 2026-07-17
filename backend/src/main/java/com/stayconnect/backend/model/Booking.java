package com.stayconnect.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    private String id;
    
    private String customerId;
    private String customerName;
    private String homestayId;
    private String homestayName;
    private String roomId;
    private String roomNumber;
    private String checkIn;
    private String checkOut;
    private Double amount;
    private String status; // "pending" | "confirmed" | "cancelled" | "completed"
    private String bookingDate;

    public Booking() {}

    public Booking(String id, String customerId, String customerName, String homestayId, String homestayName, String roomId, String roomNumber, String checkIn, String checkOut, Double amount, String status, String bookingDate) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.homestayId = homestayId;
        this.homestayName = homestayName;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.amount = amount;
        this.status = status;
        this.bookingDate = bookingDate;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String customerId;
        private String customerName;
        private String homestayId;
        private String homestayName;
        private String roomId;
        private String roomNumber;
        private String checkIn;
        private String checkOut;
        private Double amount;
        private String status;
        private String bookingDate;

        public Builder id(String id) { this.id = id; return this; }
        public Builder customerId(String customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder homestayId(String homestayId) { this.homestayId = homestayId; return this; }
        public Builder homestayName(String homestayName) { this.homestayName = homestayName; return this; }
        public Builder roomId(String roomId) { this.roomId = roomId; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder checkIn(String checkIn) { this.checkIn = checkIn; return this; }
        public Builder checkOut(String checkOut) { this.checkOut = checkOut; return this; }
        public Builder amount(Double amount) { this.amount = amount; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder bookingDate(String bookingDate) { this.bookingDate = bookingDate; return this; }

        public Booking build() {
            return new Booking(id, customerId, customerName, homestayId, homestayName, roomId, roomNumber, checkIn, checkOut, amount, status, bookingDate);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getHomestayId() { return homestayId; }
    public void setHomestayId(String homestayId) { this.homestayId = homestayId; }
    public String getHomestayName() { return homestayName; }
    public void setHomestayName(String homestayName) { this.homestayName = homestayName; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getCheckIn() { return checkIn; }
    public void setCheckIn(String checkIn) { this.checkIn = checkIn; }
    public String getCheckOut() { return checkOut; }
    public void setCheckOut(String checkOut) { this.checkOut = checkOut; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
}
