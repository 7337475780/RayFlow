package com.rayflow.contracts.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Root", description = "Root entrypoint and redirection")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "Redirect to API documentation", description = "Redirects root URL requests to Swagger UI.")
    public RedirectView redirectToSwagger() {
        return new RedirectView("/swagger-ui/index.html");
    }
}
