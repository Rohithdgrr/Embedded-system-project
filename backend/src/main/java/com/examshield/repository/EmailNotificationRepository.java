package com.examshield.repository;

import com.examshield.model.EmailNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailNotificationRepository extends JpaRepository<EmailNotification, Long> {
    
    List<EmailNotification> findByStatusOrderByCreatedAtAsc(EmailNotification.Status status);
    
    @Query("SELECT e FROM EmailNotification e WHERE e.status IN ('PENDING', 'RETRYING') ORDER BY e.createdAt ASC")
    List<EmailNotification> findPendingEmails();
    
    List<EmailNotification> findByStatusAndRetryCountLessThan(EmailNotification.Status status, Integer maxRetries);
    
    long countByStatus(EmailNotification.Status status);
}
