package com.charcha.charcha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class CharchaApplication {
	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		System.setProperty("spring.data.mongodb.uri", dotenv.get("MONGO_URI"));
		SpringApplication.run(CharchaApplication.class, args);
	}

}
