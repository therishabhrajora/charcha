package com.charcha.charcha.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Message {

    private String sender;
    private String content;
    private String roomId;
    private LocalDateTime timeStamp;

    public Message(String sender, String content, String roomId) {
        this.sender = sender;
        this.content = content;
        this.roomId = roomId;
        this.timeStamp = LocalDateTime.now();
    }
}
