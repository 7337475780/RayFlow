package com.rayflow.contracts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ContractsApplication {
    public static void main(String[] args) {
        SpringApplication.run(ContractsApplication.class, args);
    }
}

