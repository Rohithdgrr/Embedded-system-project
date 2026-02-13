package com.examshield.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alert_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "alert_history_seq")
    @SequenceGenerator(name = "alert_history_seq", sequenceName = "alert_history_seq", allocationSize = 1)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ExamSession session;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertLevel alertLevel;
    
    @Column(nullable = false)
    private String message;
    
    @Column(name = "person_id")
    private String personId;
    
    @Column(name = "event_type")
    private String eventType;
    
    @Column(name = "is_acknowledged")
    private Boolean isAcknowledged;
    
    @Column(name = "acknowledged_by")
    private String acknowledgedBy;
    
    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (isAcknowledged == null) {
            isAcknowledged = false;
        }
    }
    
    public enum AlertLevel {
        GREEN,
        YELLOW,
        ORANGE,
        RED,
        CRITICAL
    }
}
