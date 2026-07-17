package com.stayconnect.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "homestays")
public class Homestay {
    @Id
    private String id;
    
    private String name;
    private String address;
    private String city;
    private String state;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Double pricePerNight;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "homestay_amenities", joinColumns = @JoinColumn(name = "homestay_id"))
    @Column(name = "amenity")
    private List<String> amenities;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "homestay_images", joinColumns = @JoinColumn(name = "homestay_id"))
    @Column(name = "image_url")
    private List<String> images;
    
    private String status; // "active" | "inactive"

    public Homestay() {}

    public Homestay(String id, String name, String address, String city, String state, String description, Double pricePerNight, List<String> amenities, List<String> images, String status) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.state = state;
        this.description = description;
        this.pricePerNight = pricePerNight;
        this.amenities = amenities;
        this.images = images;
        this.status = status;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String address;
        private String city;
        private String state;
        private String description;
        private Double pricePerNight;
        private List<String> amenities;
        private List<String> images;
        private String status;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder pricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; return this; }
        public Builder amenities(List<String> amenities) { this.amenities = amenities; return this; }
        public Builder images(List<String> images) { this.images = images; return this; }
        public Builder status(String status) { this.status = status; return this; }

        public Homestay build() {
            return new Homestay(id, name, address, city, state, description, pricePerNight, amenities, images, status);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
