package com.charcha.charcha.controllers;

import com.charcha.charcha.config.AppConstants;
import com.charcha.charcha.entities.Message;
import com.charcha.charcha.entities.Room;
import com.charcha.charcha.payload.MessageRequest;
import com.charcha.charcha.repositories.RoomRepo;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin(origins = {
        AppConstants.FRONTNED_BASE_URL_LOCAL, AppConstants.FRONTNED_BASE_URL_NETLIFY,AppConstants.FRONTNED_BASE_URL_RENDER
})
public class ChatController {
    private RoomRepo roomRepo;

    public ChatController(RoomRepo roomRepo) {
        this.roomRepo = roomRepo;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest request) {
        Room room = roomRepo.findByRoomId(request.getRoomId());
        Message msg = new Message();
        msg.setContent(request.getContent());
        msg.setSender(request.getSender());
        msg.setTimeStamp(LocalDateTime.now());
        if (room != null) {
            room.getMessages().add(msg);
            roomRepo.save(room);
        } else {
            throw new RuntimeException("room not found!!");
        }

        return msg;

    }
}
