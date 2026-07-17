package com.stayconnect.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "settings")
public class Settings {
    @Id
    private String systemName;
    
    private String contactEmail;
    private String currency;
    private Double taxes;
    
    @Column(columnDefinition = "TEXT")
    private String bookingRules;

    public Settings() {}

    public Settings(String systemName, String contactEmail, String currency, Double taxes, String bookingRules) {
        this.systemName = systemName;
        this.contactEmail = contactEmail;
        this.currency = currency;
        this.taxes = taxes;
        this.bookingRules = bookingRules;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String systemName;
        private String contactEmail;
        private String currency;
        private Double taxes;
        private String bookingRules;

        public Builder systemName(String systemName) { this.systemName = systemName; return this; }
        public Builder contactEmail(String contactEmail) { this.contactEmail = contactEmail; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder taxes(Double taxes) { this.taxes = taxes; return this; }
        public Builder bookingRules(String bookingRules) { this.bookingRules = bookingRules; return this; }

        public Settings build() {
            return new Settings(systemName, contactEmail, currency, taxes, bookingRules);
        }
    }

    // Getters and Setters
    public String getSystemName() { return systemName; }
    public void setSystemName(String systemName) { this.systemName = systemName; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Double getTaxes() { return taxes; }
    public void setTaxes(Double taxes) { this.taxes = taxes; }
    public String getBookingRules() { return bookingRules; }
    public void setBookingRules(String bookingRules) { this.bookingRules = bookingRules; }
}
