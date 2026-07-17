package com.stayconnect.backend.repository;

import com.stayconnect.backend.model.Homestay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HomestayRepository extends JpaRepository<Homestay, String> {
}
