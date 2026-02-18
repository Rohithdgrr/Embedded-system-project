package com.examshield.service;

import com.examshield.model.EmailNotification;
import com.examshield.repository.EmailNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Properties;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailProcessorService {

    private final EmailNotificationRepository emailRepository;

    private static final String SMTP_HOST = "smtp-relay.brevo.com";
    private static final String SMTP_PORT = "587";

    // IMPORTANT: This must be an email verified in your Brevo account!
    // Go to: Brevo Dashboard → Settings → Senders & IPs → Senders tab → Add a
    // sender
    // Verify the email, then put it here
    @Value("${brevo.sender.email:rreon633@gmail.com}")
    private String fromEmail;
    
    private static final String FROM_NAME = "ExamShield AI";

    // Brevo SMTP key - loaded from environment variable BREVO_SMTP_KEY
    @Value("${brevo.smtp.key:}")
    private String brevoSmtpKey;
    
    private static final int MAX_RETRIES = 3;

    @Scheduled(fixedDelay = 10000) // Run every 10 seconds
    @Transactional
    public void processPendingEmails() {
        List<EmailNotification> pendingEmails = emailRepository.findPendingEmails();

        if (!pendingEmails.isEmpty()) {
            log.info("Processing {} pending emails", pendingEmails.size());
        }

        for (EmailNotification email : pendingEmails) {
            sendWithFallbacks(email);
        }
    }

    private void sendWithFallbacks(EmailNotification email) {
        try {
            sendViaBrevoSmtp(email);
            markSent(email);
        } catch (AuthenticationFailedException e) {
            log.error("Brevo SMTP authentication failed. Check your API key. Error: {}", e.getMessage());
            handleEmailFailure(email, "SMTP Auth failed: " + e.getMessage() +
                    " — Verify BREVO_SMTP_KEY is correct. Username must be 'apikey' and password is the SMTP key from Brevo dashboard.");
        } catch (SendFailedException e) {
            log.error("Brevo rejected the email. Check sender email verification. Error: {}", e.getMessage());
            handleEmailFailure(email, "Send failed: " + e.getMessage() +
                    " — FROM_EMAIL '" + fromEmail + "' may not be verified in Brevo. " +
                    "Go to Brevo → Settings → Senders & IPs to verify it.");
        } catch (MessagingException e) {
            log.error("SMTP error sending to {}: {}", safeRecipient(email), e.getMessage());

            // If it's a connection issue, try SSL on port 465 as fallback
            if (e.getMessage() != null &&
                    (e.getMessage().contains("connect") || e.getMessage().contains("timeout"))) {
                try {
                    log.info("Retrying with SSL on port 465...");
                    sendViaBrevoSmtpSSL(email);
                    markSent(email);
                    return;
                } catch (Exception fallbackEx) {
                    log.error("SSL fallback also failed: {}", fallbackEx.getMessage());
                }
            }

            handleEmailFailure(email, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", safeRecipient(email), e.getMessage());
            handleEmailFailure(email, e.getMessage());
        }
    }

    private void sendViaBrevoSmtp(EmailNotification email) throws Exception {
        // Update status to SENDING
        email.setStatus(EmailNotification.Status.SENDING);
        emailRepository.save(email);

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                // Brevo SMTP relay: username = "apikey", password = your SMTP key
                return new PasswordAuthentication("apikey", brevoSmtpKey);
            }
        });

        // Enable debug logging for SMTP troubleshooting
        session.setDebug(false); // Set to true for detailed SMTP logs

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromEmail, FROM_NAME));
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(email.getRecipientEmail()));
        message.setSubject(email.getSubject());

        // Send as HTML if available, otherwise plain text
        if (email.getHtmlContent() != null && !email.getHtmlContent().isEmpty()) {
            message.setContent(email.getHtmlContent(), "text/html; charset=utf-8");
        } else {
            message.setText(email.getMessage());
        }

        Transport.send(message);
    }

    /**
     * Fallback: Send via Brevo SMTP using SSL on port 465
     * Some networks/firewalls block port 587 STARTTLS but allow 465 SSL
     */
    private void sendViaBrevoSmtpSSL(EmailNotification email) throws Exception {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", "465");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("apikey", brevoSmtpKey);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromEmail, FROM_NAME));
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(email.getRecipientEmail()));
        message.setSubject(email.getSubject());

        if (email.getHtmlContent() != null && !email.getHtmlContent().isEmpty()) {
            message.setContent(email.getHtmlContent(), "text/html; charset=utf-8");
        } else {
            message.setText(email.getMessage());
        }

        Transport.send(message);
        log.info("Email sent successfully via SSL fallback to: {}", safeRecipient(email));
    }

    private void markSent(EmailNotification email) {
        email.setStatus(EmailNotification.Status.SENT);
        email.setSentAt(LocalDateTime.now());
        emailRepository.save(email);
        log.info("Email sent successfully to: {}", safeRecipient(email));
    }

    private void handleEmailFailure(EmailNotification email, String errorMessage) {
        email.setRetryCount(email.getRetryCount() + 1);
        email.setErrorMessage(errorMessage);

        if (email.getRetryCount() >= MAX_RETRIES) {
            email.setStatus(EmailNotification.Status.FAILED);
            log.error("Email to {} failed after {} retries. Last error: {}",
                    email.getRecipientEmail(), MAX_RETRIES, errorMessage);
        } else {
            email.setStatus(EmailNotification.Status.RETRYING);
            log.warn("Email to {} will retry ({}/{}). Error: {}",
                    email.getRecipientEmail(), email.getRetryCount(), MAX_RETRIES, errorMessage);
        }

        emailRepository.save(email);
    }

    public long getPendingCount() {
        return emailRepository.countByStatus(EmailNotification.Status.PENDING);
    }

    public long getFailedCount() {
        return emailRepository.countByStatus(EmailNotification.Status.FAILED);
    }

    private String safeRecipient(EmailNotification email) {
        try {
            return email.getRecipientEmail();
        } catch (Exception e) {
            return "<unknown>";
        }
    }
}
