package com.stayconnect.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    private String id;
    
    private String bookingId;
    private Double amount;
    private String paymentMethod; // "Cash" | "UPI" | "Credit Card"
    private String status; // "Paid" | "Pending" | "Failed"
    private String paymentDate;

    public Payment() {}

    public Payment(String id, String bookingId, Double amount, String paymentMethod, String status, String paymentDate) {
        this.id = id;
        this.bookingId = bookingId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.paymentDate = paymentDate;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String bookingId;
        private Double amount;
        private String paymentMethod;
        private String status;
        private String paymentDate;

        public Builder id(String id) { this.id = id; return this; }
        public Builder bookingId(String bookingId) { this.bookingId = bookingId; return this; }
        public Builder amount(Double amount) { this.amount = amount; return this; }
        public Builder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder paymentDate(String paymentDate) { this.paymentDate = paymentDate; return this; }

        public Payment build() {
            return new Payment(id, bookingId, amount, paymentMethod, status, paymentDate);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }
}
