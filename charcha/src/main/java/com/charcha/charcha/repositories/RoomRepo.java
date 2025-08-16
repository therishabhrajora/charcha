package com.charcha.charcha.repositories;


import com.charcha.charcha.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepo extends MongoRepository<Room,Integer> {
    Room findByRoomId(String roomId);
}
