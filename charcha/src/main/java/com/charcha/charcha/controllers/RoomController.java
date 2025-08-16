package com.charcha.charcha.controllers;

import com.charcha.charcha.config.AppConstants;
import com.charcha.charcha.entities.Message;
import com.charcha.charcha.entities.Room;
import com.charcha.charcha.repositories.RoomRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin(origins = {
        AppConstants.FRONTNED_BASE_URL_LOCAL, AppConstants.FRONTNED_BASE_URL_NETLIFY
})
public class RoomController {
    private final RoomRepo roomRepo;

    public RoomController(RoomRepo roomRepo) {
        this.roomRepo = roomRepo;
    }

    // create room
    @PostMapping
    public ResponseEntity<?> createrRoom(@RequestBody Room rooms) {
        Room roomexist = roomRepo.findByRoomId(rooms.getRoomId());
        if (roomexist != null) {
            // room is already there
            return ResponseEntity.badRequest().body("room is alredy exists");
        }
        Room room = new Room();
        room.setRoomId(rooms.getRoomId());
        Room savedRoom = roomRepo.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);

    }

    // get room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
        Room room = roomRepo.findByRoomId(roomId);

        if (room == null) {
            return ResponseEntity.badRequest().body("Room not exist");
        }

        return ResponseEntity.ok(room);
    }

    // get message of rooms
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<?> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "page", defaultValue = "20", required = false) int size) {
        Room room = roomRepo.findByRoomId(roomId);
        if (room == null) {

            return ResponseEntity.badRequest().build();
        }

        List<Message> messages = room.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);

        List<Message> paginatedMessages = messages.subList(start, end);

        return ResponseEntity.ok(messages);

    }

}
