package com.rayflow.contracts.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("RayFlow Contracts Management API")
                        .version("1.0.0")
                        .description("REST API endpoints for monitoring agreements, filtering lifecycles, and auditing workflow history transitions.")
                        .contact(new Contact()
                                .name("RayFlow Engineering Support")
                                .email("support@rayflow.com")));
    }
}
