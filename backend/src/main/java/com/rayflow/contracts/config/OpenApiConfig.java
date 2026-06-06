package com.rayflow.contracts.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${openapi.server.url:http://localhost:8080}")
    private String serverUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .servers(List.of(new Server().url(serverUrl).description("Active Environment Server")))
                .info(new Info()
                        .title("RayFlow Contracts Management API")
                        .version("1.0.0")
                        .description("REST API endpoints for monitoring agreements, filtering lifecycles, and auditing workflow history transitions.")
                        .contact(new Contact()
                                .name("RayFlow Engineering Support")
                                .email("support@rayflow.com")));
    }
}
