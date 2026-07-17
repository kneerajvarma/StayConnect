package com.stayconnect.backend.repository;

import com.stayconnect.backend.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, String> {
}
