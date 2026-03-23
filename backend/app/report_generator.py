from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
import io

def generate_pdf_report(case_data):
    # Setup buffer
    buffer = io.BytesIO()
    
    # Create the PDF object, using the buffer as its "file."
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Header
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, height - 100, "AML Investigation Report")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, height - 130, f"Case ID: {case_data.get('id', 'N/A')}")
    p.drawString(100, height - 150, f"Account ID: {case_data.get('accountId', 'N/A')}")
    p.drawString(100, height - 170, f"Risk Score: {case_data.get('riskScore', 'N/A')}")
    p.drawString(100, height - 190, f"Status: {case_data.get('status', 'N/A').upper()}")
    
    
    p.setFont("Helvetica-Bold", 14)
    p.drawString(100, height - 230, "Detected Fraud Patterns")
    p.setFont("Helvetica", 12)
    patterns = case_data.get("fraudPatterns", [])
    y_pos = height - 250
    if not patterns:
        p.drawString(100, y_pos, "None detected.")
    else:
        for pat in patterns:
            p.drawString(120, y_pos, f"- {pat}")
            y_pos -= 20
            
    p.setFont("Helvetica-Bold", 14)
    y_pos -= 20
    p.drawString(100, y_pos, "Investigator Notes")
    p.setFont("Helvetica", 12)
    y_pos -= 20
    
    notes = case_data.get("investigatorNotes", "No notes provided.")
    # Simple wrap text logic for notes
    chars_per_line = 60
    for i in range(0, len(notes), chars_per_line):
        p.drawString(100, y_pos, notes[i:i+chars_per_line])
        y_pos -= 20
    
    # Close the PDF object cleanly, and we're done.
    p.showPage()
    p.save()
    
    # Get the value of the BytesIO buffer and return it
    pdf = buffer.getvalue()
    buffer.close()
    return pdf
