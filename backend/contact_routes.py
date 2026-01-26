from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
import os
import asyncio
import logging
import resend

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize Resend
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('EMAIL_FROM', 'onboarding@resend.dev')

# IMPORTANT: Resend test mode only allows sending to verified emails
# For production: Verify your domain at resend.com/domains
# Then update CONTACT_EMAIL to: chaunxaioyun21305@gmail.com
CONTACT_RECIPIENT = os.environ.get('CONTACT_EMAIL', 'minhtetmyet2630@gmail.com')


class ContactFormRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    company: str
    message: str


@router.post("/contact")
async def send_contact_email(request: ContactFormRequest):
    """Send contact form email to admin"""
    try:
        # Build HTML email content
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">LuminaHR Website</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Name:</strong>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                            {request.first_name} {request.last_name}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Email:</strong>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <a href="mailto:{request.email}" style="color: #6366f1; text-decoration: none;">{request.email}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Company:</strong>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                            {request.company}
                        </td>
                    </tr>
                </table>
                
                <div style="margin-top: 20px;">
                    <strong style="color: #374151;">Message:</strong>
                    <div style="margin-top: 10px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; color: #1f2937; line-height: 1.6;">
                        {request.message}
                    </div>
                </div>
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                        This email was sent from the LuminaHR contact form.
                    </p>
                </div>
            </div>
        </div>
        """
        
        params = {
            "from": SENDER_EMAIL,
            "to": [CONTACT_RECIPIENT],
            "subject": f"New Contact: {request.first_name} {request.last_name} from {request.company}",
            "html": html_content,
            "reply_to": request.email
        }
        
        # Run sync SDK in thread to keep FastAPI non-blocking
        email_response = await asyncio.to_thread(resend.Emails.send, params)
        
        logger.info(f"Contact email sent successfully to {CONTACT_RECIPIENT}")
        
        return {
            "status": "success",
            "message": "Your message has been sent successfully. We'll get back to you soon!",
            "email_id": email_response.get("id")
        }
        
    except Exception as e:
        logger.error(f"Failed to send contact email: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send message. Please try again later."
        )
