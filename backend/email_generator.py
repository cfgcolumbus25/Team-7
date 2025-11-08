"""
AI-powered email generator for research updates.
Generates professional, engaging emails summarizing new research contributions.
"""

import os
from typing import List, Dict, Any
import google.generativeai as genai


def generate_research_email(changes: List[Dict[str, Any]]) -> Dict[str, str]:
    """
    Generate a professional email summarizing research changes using AI.
    
    Args:
        changes: List of research tile changes with keys:
                 - id: unique identifier
                 - type: change type (e.g., 'research_tile_added')
                 - title: research project title
                 - year: project year
                 - amount: funding amount
                 - impact: brief impact description
                 - timestamp: when the change was made
    
    Returns:
        Dict with 'subject' and 'body' keys containing the generated email
    """
    if not changes:
        return {
            'subject': 'No Updates Available',
            'body': 'There are currently no pending research updates to share.'
        }
    
    # Build context for AI
    research_summaries = []
    for change in changes:
        summary = f"""
Title: {change.get('title', 'Untitled Project')}
Year: {change.get('year', 'N/A')}
Funding: {change.get('amount', 'N/A')}
Impact: {change.get('impact', 'No description available')}
"""
        research_summaries.append(summary.strip())
    
    context = "\n\n".join(research_summaries)
    
    # Try to use Gemini if API key is available
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        try:
            return _generate_with_gemini(context, len(changes))
        except Exception as e:
            print(f"Gemini generation failed: {e}, falling back to template")
            return _generate_template_email(changes)
    else:
        print("No Gemini API key found, using template email")
        return _generate_template_email(changes)


def _generate_with_gemini(research_context: str, count: int) -> Dict[str, str]:
    """
    Generate email using Google Gemini API.
    
    Args:
        research_context: Formatted string with all research project details
        count: Number of research projects
    
    Returns:
        Dict with 'subject' and 'body' keys
    """
    # Configure Gemini
    api_key = os.getenv('GEMINI_API_KEY')
    genai.configure(api_key=api_key)
    
    # Use Gemini Pro model
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""You are writing a professional email to stakeholders about new research updates from a medical research foundation. 

Here are {count} new research project(s) that have been approved and need to be communicated:

{research_context}

Please generate:
1. A compelling subject line (max 60 characters)
2. A warm, professional email body that:
   - Opens with a friendly greeting
   - Provides an engaging summary of each research project highlighting its potential impact
   - Uses accessible language (avoid jargon)
   - Conveys enthusiasm and gratitude for stakeholder support
   - Ends with a call to action or invitation for questions
   - Signs off professionally

Format the response as:
SUBJECT: [subject line]

BODY:
[email body]
"""
    
    response = model.generate_content(prompt)
    generated_text = response.text.strip()
    
    # Parse the response
    if 'SUBJECT:' in generated_text and 'BODY:' in generated_text:
        parts = generated_text.split('BODY:', 1)
        subject = parts[0].replace('SUBJECT:', '').strip()
        body = parts[1].strip()
    else:
        # Fallback parsing
        lines = generated_text.split('\n', 1)
        subject = lines[0].strip()
        body = lines[1].strip() if len(lines) > 1 else generated_text
    
    return {
        'subject': subject,
        'body': body
    }


def _generate_template_email(changes: List[Dict[str, Any]]) -> Dict[str, str]:
    """Generate email using a template (fallback when AI is unavailable)."""
    count = len(changes)
    subject = f"Exciting Research Updates: {count} New Project{'s' if count > 1 else ''} Approved"
    
    # Build project list
    project_details = []
    for i, change in enumerate(changes, 1):
        title = change.get('title', 'Untitled Project')
        year = change.get('year', 'N/A')
        amount = change.get('amount', 'N/A')
        impact = change.get('impact', 'No description available.')
        
        detail = f"""{i}. {title} ({year})
   Funding: {amount}
   Impact: {impact}"""
        project_details.append(detail)
    
    projects_text = "\n\n".join(project_details)
    
    body = f"""Dear Valued Stakeholders,

We're thrilled to share exciting updates from our research team! We've recently approved {count} groundbreaking research project{'s' if count > 1 else ''} that will advance our mission to improve lives through medical innovation.

{projects_text}

These projects represent our continued commitment to funding impactful research that makes a real difference in people's lives. Your support makes this work possible, and we're grateful for your partnership in our mission.

If you have any questions about these projects or would like more information, please don't hesitate to reach out. We'd love to hear from you!

Warm regards,
The Research Team

---
Stay connected with our latest updates and discoveries."""
    
    return {
        'subject': subject,
        'body': body
    }
