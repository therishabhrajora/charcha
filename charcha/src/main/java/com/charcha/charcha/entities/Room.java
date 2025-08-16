package com.charcha.charcha.entities;


import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;


@Document(collection = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Room {
    private String id;
    private  String roomId;
    private List<Message> messages= new ArrayList<>();


}
