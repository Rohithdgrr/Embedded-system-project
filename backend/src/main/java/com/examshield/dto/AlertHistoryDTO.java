package com.examshield.dto;

import com.examshield.model.AlertHistory;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertHistoryDTO {
    
    private Long id;
    private Long sessionId;
    private AlertHistory.AlertLevel alertLevel;
    private String message;
    private String personId;
    private String eventType;
    private Boolean isAcknowledged;
    private String acknowledgedBy;
    private LocalDateTime acknowledgedAt;
    private LocalDateTime timestamp;
    
    public static AlertHistoryDTO fromEntity(AlertHistory alert) {
        return AlertHistoryDTO.builder()
                .id(alert.getId())
                .sessionId(alert.getSession().getId())
                .alertLevel(alert.getAlertLevel())
                .message(alert.getMessage())
                .personId(alert.getPersonId())
                .eventType(alert.getEventType())
                .isAcknowledged(alert.getIsAcknowledged())
                .acknowledgedBy(alert.getAcknowledgedBy())
                .acknowledgedAt(alert.getAcknowledgedAt())
                .timestamp(alert.getTimestamp())
                .build();
    }
}
