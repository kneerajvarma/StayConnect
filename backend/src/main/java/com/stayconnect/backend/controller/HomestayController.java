package com.stayconnect.backend.controller;

import com.stayconnect.backend.model.Homestay;
import com.stayconnect.backend.repository.HomestayRepository;
import com.stayconnect.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/homestays")
@CrossOrigin(origins = "*")
public class HomestayController {

    @Autowired
    private HomestayRepository homestayRepository;

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<Homestay> getAll() {
        return homestayRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Homestay> getById(@PathVariable String id) {
        return homestayRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Homestay create(@RequestBody Homestay homestay) {
        if (homestay.getId() == null || homestay.getId().isEmpty()) {
            homestay.setId("h_" + UUID.randomUUID().toString().substring(0, 8));
        }
        return homestayRepository.save(homestay);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Homestay> update(@PathVariable String id, @RequestBody Homestay homestay) {
        Optional<Homestay> originalOpt = homestayRepository.findById(id);
        if (originalOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Homestay original = originalOpt.get();
        if (homestay.getName() != null) original.setName(homestay.getName());
        if (homestay.getAddress() != null) original.setAddress(homestay.getAddress());
        if (homestay.getCity() != null) original.setCity(homestay.getCity());
        if (homestay.getState() != null) original.setState(homestay.getState());
        if (homestay.getDescription() != null) original.setDescription(homestay.getDescription());
        if (homestay.getPricePerNight() != null) original.setPricePerNight(homestay.getPricePerNight());
        if (homestay.getAmenities() != null) original.setAmenities(homestay.getAmenities());
        if (homestay.getImages() != null) original.setImages(homestay.getImages());
        if (homestay.getStatus() != null) original.setStatus(homestay.getStatus());
        
        return ResponseEntity.ok(homestayRepository.save(original));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!homestayRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        homestayRepository.deleteById(id);
        // Cascade delete rooms associated with this homestay
        roomRepository.deleteAll(roomRepository.findByHomestayId(id));
        return ResponseEntity.ok().build();
    }
}
