package com.stayconnect.backend.controller;

import com.stayconnect.backend.model.Settings;
import com.stayconnect.backend.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private SettingsRepository settingsRepository;

    @GetMapping
    public ResponseEntity<Settings> getSettings() {
        List<Settings> settingsList = settingsRepository.findAll();
        if (settingsList.isEmpty()) {
            Settings defaults = Settings.builder()
                    .systemName("StayConnect")
                    .contactEmail("support@stayconnect.com")
                    .currency("INR")
                    .taxes(12.5)
                    .bookingRules("Standard 24-hour cancelation notice. Check-in 3:00 PM, Check-out 11:00 AM. No smoking inside the premises.")
                    .build();
            return ResponseEntity.ok(settingsRepository.save(defaults));
        }
        return ResponseEntity.ok(settingsList.get(0));
    }

    @PutMapping
    public Settings updateSettings(@RequestBody Settings updated) {
        List<Settings> settingsList = settingsRepository.findAll();
        if (!settingsList.isEmpty()) {
            Settings existing = settingsList.get(0);
            if (existing.getSystemName().equals(updated.getSystemName())) {
                existing.setContactEmail(updated.getContactEmail());
                existing.setCurrency(updated.getCurrency());
                existing.setTaxes(updated.getTaxes());
                existing.setBookingRules(updated.getBookingRules());
                return settingsRepository.saveAndFlush(existing);
            } else {
                settingsRepository.delete(existing);
                settingsRepository.flush();
            }
        }
        return settingsRepository.saveAndFlush(updated);
    }
}
