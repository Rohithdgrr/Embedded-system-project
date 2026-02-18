package com.examshield.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailNotification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "email_seq")
    @SequenceGenerator(name = "email_seq", sequenceName = "email_seq", allocationSize = 1)
    private Long id;
    
    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;
    
    @Column(name = "subject", nullable = false)
    private String subject;
    
    @Column(name = "message", nullable = false, length = 2000)
    private String message;
    
    @Column(name = "html_content", length = 4000)
    private String htmlContent;
    
    @Column(name = "violation_type")
    private String violationType;
    
    @Column(name = "seat")
    private String seat;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;
    
    @Column(name = "retry_count")
    private Integer retryCount;
    
    @Column(name = "error_message", length = 1000)
    private String errorMessage;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = Status.PENDING;
        }
        if (retryCount == null) {
            retryCount = 0;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum Status {
        PENDING,
        SENDING,
        SENT,
        FAILED,
        RETRYING
    }
}
