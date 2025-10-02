# utils/email.py
import smtplib
from email.message import EmailMessage
from flask import current_app

def send_email(to_email: str, subject: str, body: str):
    cfg = current_app.config
    
    # If mail server still default placeholder, log and return
    if cfg.get("MAIL_SERVER", "") in ("smtp.example.com", ""):
        current_app.logger.info("Email (placeholder): To=%s Subject=%s Body=%s", to_email, subject, body)
        return True

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = cfg.get("MAIL_DEFAULT_SENDER")
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP(cfg["MAIL_SERVER"], cfg["MAIL_PORT"]) as s:
        if cfg.get("MAIL_USE_TLS"):
            s.starttls()
        if cfg.get("MAIL_USERNAME"):
            s.login(cfg["MAIL_USERNAME"], cfg["MAIL_PASSWORD"])
        s.send_message(msg)
    return True
