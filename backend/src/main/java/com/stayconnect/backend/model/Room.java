package com.stayconnect.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {
    @Id
    private String id;
    
    private String homestayId;
    private String roomNumber;
    private String roomType; // "Standard" | "Deluxe" | "Suite" | "Family"
    private Integer capacity;
    private Double price;
    private Boolean availability;

    public Room() {}

    public Room(String id, String homestayId, String roomNumber, String roomType, Integer capacity, Double price, Boolean availability) {
        this.id = id;
        this.homestayId = homestayId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.capacity = capacity;
        this.price = price;
        this.availability = availability;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String homestayId;
        private String roomNumber;
        private String roomType;
        private Integer capacity;
        private Double price;
        private Boolean availability;

        public Builder id(String id) { this.id = id; return this; }
        public Builder homestayId(String homestayId) { this.homestayId = homestayId; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder roomType(String roomType) { this.roomType = roomType; return this; }
        public Builder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public Builder price(Double price) { this.price = price; return this; }
        public Builder availability(Boolean availability) { this.availability = availability; return this; }

        public Room build() {
            return new Room(id, homestayId, roomNumber, roomType, capacity, price, availability);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getHomestayId() { return homestayId; }
    public void setHomestayId(String homestayId) { this.homestayId = homestayId; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Boolean getAvailability() { return availability; }
    public void setAvailability(Boolean availability) { this.availability = availability; }
}
