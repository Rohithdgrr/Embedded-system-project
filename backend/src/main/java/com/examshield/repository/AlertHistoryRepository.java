package com.examshield.repository;

import com.examshield.model.AlertHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertHistoryRepository extends JpaRepository<AlertHistory, Long> {
    
    List<AlertHistory> findBySessionId(Long sessionId);
    
    List<AlertHistory> findBySessionIdOrderByTimestampDesc(Long sessionId);
    
    List<AlertHistory> findBySessionIdAndIsAcknowledgedFalse(Long sessionId);
    
    @Query("SELECT a FROM AlertHistory a WHERE a.session.id = :sessionId AND a.timestamp >= :since")
    List<AlertHistory> findBySessionIdAndTimestampAfter(Long sessionId, LocalDateTime since);
    
    @Query("SELECT a FROM AlertHistory a WHERE a.session.id = :sessionId AND a.alertLevel IN ('RED', 'CRITICAL') AND a.isAcknowledged = false")
    List<AlertHistory> findUnacknowledgedCriticalAlerts(Long sessionId);
    
    @Query("SELECT COUNT(a) FROM AlertHistory a WHERE a.session.id = :sessionId AND a.isAcknowledged = false")
    Long countUnacknowledgedBySessionId(Long sessionId);
}
