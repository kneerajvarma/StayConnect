package com.stayconnect.backend.controller;

import com.stayconnect.backend.model.Room;
import com.stayconnect.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<Room> getAll() {
        return roomRepository.findAll();
    }

    @GetMapping("/homestay/{homestayId}")
    public List<Room> getByHomestay(@PathVariable String homestayId) {
        return roomRepository.findByHomestayId(homestayId);
    }

    @PostMapping
    public Room create(@RequestBody Room room) {
        if (room.getId() == null || room.getId().isEmpty()) {
            room.setId("r_" + UUID.randomUUID().toString().substring(0, 8));
        }
        return roomRepository.save(room);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> update(@PathVariable String id, @RequestBody Room room) {
        Optional<Room> originalOpt = roomRepository.findById(id);
        if (originalOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Room original = originalOpt.get();
        if (room.getRoomNumber() != null) original.setRoomNumber(room.getRoomNumber());
        if (room.getRoomType() != null) original.setRoomType(room.getRoomType());
        if (room.getCapacity() != null) original.setCapacity(room.getCapacity());
        if (room.getPrice() != null) original.setPrice(room.getPrice());
        if (room.getAvailability() != null) original.setAvailability(room.getAvailability());
        
        return ResponseEntity.ok(roomRepository.save(original));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!roomRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        roomRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
