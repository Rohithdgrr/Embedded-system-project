package com.examshield.service;

import com.examshield.dto.*;
import com.examshield.model.*;
import com.examshield.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {
    
    private final ExamSessionRepository examSessionRepository;
    private final DetectionEventRepository detectionEventRepository;
    private final StudentScoreRepository studentScoreRepository;
    private final AlertHistoryRepository alertHistoryRepository;
    
    public SessionReportDTO generateReport(Long sessionId) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        List<DetectionEvent> events = detectionEventRepository.findBySessionId(sessionId);
        List<StudentScore> scores = studentScoreRepository.findBySessionId(sessionId);
        List<AlertHistory> alerts = alertHistoryRepository.findBySessionIdOrderByTimestampDesc(sessionId);
        
        Map<String, Integer> violationBreakdown = new HashMap<>();
        for (DetectionEvent event : events) {
            String eventName = event.getEventType().name();
            violationBreakdown.merge(eventName, 1, Integer::sum);
        }
        
        double avgScore = scores.stream()
                .mapToDouble(s -> s.getTotalScore() != null ? s.getTotalScore() : 0)
                .average()
                .orElse(0);
        
        double maxScore = scores.stream()
                .mapToDouble(s -> s.getTotalScore() != null ? s.getTotalScore() : 0)
                .max()
                .orElse(0);
        
        long suspiciousCount = scores.stream()
                .filter(s -> s.getAlertLevel() == StudentScore.AlertLevel.SUSPICIOUS ||
                           s.getAlertLevel() == StudentScore.AlertLevel.CRITICAL)
                .count();
        
        List<StudentScoreDTO> topStudents = scores.stream()
                .sorted((a, b) -> Double.compare(
                        b.getTotalScore() != null ? b.getTotalScore() : 0,
                        a.getTotalScore() != null ? a.getTotalScore() : 0))
                .limit(10)
                .map(StudentScoreDTO::fromEntity)
                .collect(Collectors.toList());
        
        List<DetectionEventDTO> recentDetections = events.stream()
                .sorted(Comparator.comparing(DetectionEvent::getTimestamp).reversed())
                .limit(20)
                .map(DetectionEventDTO::fromEntity)
                .collect(Collectors.toList());
        
        List<AlertHistoryDTO> recentAlerts = alerts.stream()
                .limit(10)
                .map(AlertHistoryDTO::fromEntity)
                .collect(Collectors.toList());
        
        int missingCount = 0;
        if (session.getExpectedCount() != null && session.getActualCount() != null) {
            missingCount = session.getExpectedCount() - session.getActualCount();
            if (missingCount < 0) missingCount = 0;
        }
        
        SessionReportDTO.SummaryStats summaryStats = SessionReportDTO.SummaryStats.builder()
                .totalDetections((long) events.size())
                .criticalAlerts(alerts.stream()
                        .filter(a -> a.getAlertLevel() == AlertHistory.AlertLevel.RED ||
                                   a.getAlertLevel() == AlertHistory.AlertLevel.CRITICAL)
                        .count())
                .averageScore(avgScore)
                .maxScore(maxScore)
                .suspiciousStudents((int) suspiciousCount)
                .normalStudents((int) (scores.size() - suspiciousCount))
                .build();
        
        return SessionReportDTO.builder()
                .sessionId(session.getId())
                .sessionName(session.getName())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .status(session.getStatus().name())
                .expectedCount(session.getExpectedCount())
                .actualCount(session.getActualCount())
                .missingCount(missingCount)
                .summaryStats(summaryStats)
                .topStudents(topStudents)
                .recentDetections(recentDetections)
                .recentAlerts(recentAlerts)
                .violationBreakdown(violationBreakdown)
                .build();
    }
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalSessions", examSessionRepository.count());
        stats.put("activeSessions", examSessionRepository.countByStatus(ExamSession.SessionStatus.ACTIVE));
        stats.put("completedSessions", examSessionRepository.countByStatus(ExamSession.SessionStatus.COMPLETED));
        
        List<ExamSession> recentSessions = examSessionRepository.findByOrderByCreatedAtDesc();
        stats.put("recentSessions", recentSessions.stream()
                .limit(5)
                .map(ExamSessionDTO::fromEntity)
                .collect(Collectors.toList()));
        
        return stats;
    }
}
