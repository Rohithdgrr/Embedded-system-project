package com.examshield.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSessionRequest {
    
    @NotBlank(message = "Session name is required")
    private String name;
    
    @NotNull(message = "Expected count is required")
    private Integer expectedCount;
    
    private String streamUrl;
}
