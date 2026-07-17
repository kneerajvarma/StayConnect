package com.stayconnect.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    private String id;
    
    private String homestayId;
    private String customerName;
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    private String date;

    public Review() {}

    public Review(String id, String homestayId, String customerName, Integer rating, String comment, String date) {
        this.id = id;
        this.homestayId = homestayId;
        this.customerName = customerName;
        this.rating = rating;
        this.comment = comment;
        this.date = date;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String homestayId;
        private String customerName;
        private Integer rating;
        private String comment;
        private String date;

        public Builder id(String id) { this.id = id; return this; }
        public Builder homestayId(String homestayId) { this.homestayId = homestayId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder rating(Integer rating) { this.rating = rating; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }
        public Builder date(String date) { this.date = date; return this; }

        public Review build() {
            return new Review(id, homestayId, customerName, rating, comment, date);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getHomestayId() { return homestayId; }
    public void setHomestayId(String homestayId) { this.homestayId = homestayId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
