package com.examshield.dto;

import lombok.Data;
import java.util.List;

@Data
public class NotificationRequest {
    private List<String> to;
    private String subject;
    private String message;
    private String htmlContent;
    private String violationType;
    private String seat;
    private String timestamp;
}
