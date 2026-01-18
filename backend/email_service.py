import os
import resend
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Configure Resend
resend.api_key = os.environ.get('RESEND_API_KEY')
EMAIL_FROM = os.environ.get('EMAIL_FROM', 'onboarding@resend.dev')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

async def send_verification_email(email: str, verification_token: str, company_name: str) -> bool:
    """Send email verification link to user"""
    try:
        verification_link = f"{FRONTEND_URL}/verify-email?token={verification_token}"
        
        params: resend.Emails.SendParams = {
            "from": EMAIL_FROM,
            "to": [email],
            "subject": f"Verify your email for {company_name} - LuminaHR",
            "html": f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
                    .header {{ text-align: center; margin-bottom: 40px; }}
                    .logo {{ font-size: 24px; font-weight: bold; color: #2563eb; }}
                    .content {{ background: #f9fafb; border-radius: 8px; padding: 32px; }}
                    .title {{ font-size: 24px; font-weight: 600; color: #111827; margin-bottom: 16px; }}
                    .text {{ font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 24px; }}
                    .button {{ display: inline-block; background: #2563eb; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; }}
                    .footer {{ text-align: center; margin-top: 32px; font-size: 14px; color: #6b7280; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">LuminaHR</div>
                    </div>
                    <div class="content">
                        <h1 class="title">Verify Your Email</h1>
                        <p class="text">Welcome to LuminaHR! Please verify your email address to complete your registration for {company_name}.</p>
                        <p class="text">Click the button below to verify your email:</p>
                        <p style="text-align: center;">
                            <a href="{verification_link}" class="button">Verify Email</a>
                        </p>
                        <p class="text" style="margin-top: 24px; font-size: 14px;">If you didn't create this account, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 LuminaHR. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
        }
        
        email_response = resend.Emails.send(params)
        logger.info(f"Verification email sent to {email}: {email_response}")
        return True
    except Exception as e:
        error_msg = str(e)
        # Check if it's a Resend test mode restriction
        if "You can only send testing emails to your own email address" in error_msg:
            logger.warning(f"Resend API in test mode - cannot send to {email}. Email would have been sent in production mode.")
            # In test mode, we'll consider it a success but log the limitation
            return True
        else:
            logger.error(f"Failed to send verification email to {email}: {error_msg}")
            return False

async def send_approval_notification(email: str, company_name: str) -> bool:
    """Send notification to employee that they've been approved"""
    try:
        params: resend.Emails.SendParams = {
            "from": EMAIL_FROM,
            "to": [email],
            "subject": f"Your account has been approved - LuminaHR",
            "html": f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
                    .header {{ text-align: center; margin-bottom: 40px; }}
                    .logo {{ font-size: 24px; font-weight: bold; color: #2563eb; }}
                    .content {{ background: #f0fdf4; border-radius: 8px; padding: 32px; border: 2px solid #10b981; }}
                    .title {{ font-size: 24px; font-weight: 600; color: #065f46; margin-bottom: 16px; }}
                    .text {{ font-size: 16px; color: #047857; line-height: 1.6; margin-bottom: 24px; }}
                    .button {{ display: inline-block; background: #10b981; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; }}
                    .footer {{ text-align: center; margin-top: 32px; font-size: 14px; color: #6b7280; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">LuminaHR</div>
                    </div>
                    <div class="content">
                        <h1 class="title">🎉 Account Approved!</h1>
                        <p class="text">Great news! Your account for {company_name} has been approved by your administrator.</p>
                        <p class="text">You can now access all features of LuminaHR. Click the button below to log in:</p>
                        <p style="text-align: center;">
                            <a href="{FRONTEND_URL}/login" class="button">Go to Dashboard</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2025 LuminaHR. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
        }
        
        email_response = resend.Emails.send(params)
        logger.info(f"Approval notification sent to {email}: {email_response}")
        return True
    except Exception as e:
        error_msg = str(e)
        # Check if it's a Resend test mode restriction
        if "You can only send testing emails to your own email address" in error_msg:
            logger.warning(f"Resend API in test mode - cannot send to {email}. Email would have been sent in production mode.")
            # In test mode, we'll consider it a success but log the limitation
            return True
        else:
            logger.error(f"Failed to send approval notification to {email}: {error_msg}")
            return False
