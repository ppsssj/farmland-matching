package com.seokhyeon2356.farmlandmatchingbe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FarmlandMatchingBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmlandMatchingBeApplication.class, args);
    }

}
