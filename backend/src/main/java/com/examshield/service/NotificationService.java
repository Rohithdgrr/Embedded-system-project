package com.examshield.service;

import com.examshield.dto.NotificationRequest;
import com.examshield.model.EmailNotification;
import com.examshield.repository.EmailNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final EmailNotificationRepository emailRepository;
    
    @Transactional
    public boolean queueEmail(NotificationRequest request) {
        if (request.getTo() == null || request.getTo().isEmpty()) {
            log.warn("No recipients specified");
            return false;
        }
        
        for (String recipient : request.getTo()) {
            EmailNotification email = EmailNotification.builder()
                    .recipientEmail(recipient)
                    .subject(request.getSubject())
                    .message(request.getMessage())
                    .htmlContent(request.getHtmlContent())
                    .violationType(request.getViolationType())
                    .seat(request.getSeat())
                    .status(EmailNotification.Status.PENDING)
                    .retryCount(0)
                    .build();
            
            emailRepository.save(email);
            log.info("Email queued for: {}", recipient);
        }
        
        return true;
    }
    
    @Transactional
    public boolean sendViolationAlert(String[] recipients, String violationType, String seat, double confidence) {
        String subject = String.format("🚨 VIOLATION ALERT: %s detected at Seat %s", violationType, seat);
        String message = String.format(
            "A violation has been detected during the exam monitoring session.\n\n" +
            "Violation Details:\n" +
            "- Type: %s\n" +
            "- Seat: %s\n" +
            "- Confidence: %.0f%%\n" +
            "- Time: %s\n\n" +
            "Please take immediate action.\n\n" +
            "--- ExamShield AI Automated System",
            violationType, seat, confidence * 100, LocalDateTime.now()
        );
        
        for (String recipient : recipients) {
            EmailNotification email = EmailNotification.builder()
                    .recipientEmail(recipient)
                    .subject(subject)
                    .message(message)
                    .violationType(violationType)
                    .seat(seat)
                    .status(EmailNotification.Status.PENDING)
                    .retryCount(0)
                    .build();
            
            emailRepository.save(email);
            log.info("Violation alert queued for: {}", recipient);
        }
        
        return true;
    }
    
    public long getQueueStatus() {
        return emailRepository.countByStatus(EmailNotification.Status.PENDING);
    }
}
