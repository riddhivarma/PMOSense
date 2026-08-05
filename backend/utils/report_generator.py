# backend/utils/report_generator.py
"""
PCOSENSE - PDF Report Generator
Generates structured health report documents containing vitals, screening inputs, 
prediction results, custom recommendations, and the medical disclaimer.
Uses ReportLab.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def generate_pdf_report(user_name, user_email, assessment, output_path):
    """
    Generates a professional, branded PDF assessment report.
    - user_name: Patient's name
    - user_email: Patient's email
    - assessment: The assessment document containing inputs, predictions, recommendations, and date
    - output_path: Destination filepath for the PDF
    """
    # 1. Document Setup
    # Letter size: 612 x 792 points
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    story = []
    
    # 2. Theme Colors
    PRIMARY_COLOR = colors.HexColor('#db2777')   # Soft Dark Pink
    SECONDARY_COLOR = colors.HexColor('#4f46e5') # Indigo/Purple
    BG_LIGHT_PINK = colors.HexColor('#fff1f2')   # Rose-50
    TEXT_COLOR = colors.HexColor('#1f2937')       # Dark Slate Gray
    BORDER_COLOR = colors.HexColor('#e5e7eb')     # Gray-200
    
    # 3. Typography Styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=PRIMARY_COLOR,
        alignment=TA_LEFT,
        spaceAfter=5
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#4b5563'),
        spaceAfter=15
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=SECONDARY_COLOR,
        spaceBefore=12,
        spaceAfter=8,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'ReportBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=TEXT_COLOR,
        leading=14
    )
    
    body_bold = ParagraphStyle(
        'ReportBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        textColor=colors.HexColor('#6b7280'),
        alignment=TA_CENTER,
        leading=12
    )
    
    # 4. Header Section
    header_data = [
        [
            Paragraph("PCOSENSE", title_style), 
            Paragraph(f"Date: {assessment['date'].strftime('%d-%b-%Y')}", ParagraphStyle('RightText', parent=body_style, alignment=TA_RIGHT, fontSize=11))
        ],
        [
            Paragraph("AI-Powered Early PCOS Risk Assessment & Awareness Platform", subtitle_style),
            Paragraph("Screening Report", ParagraphStyle('RightSubtext', parent=body_style, alignment=TA_RIGHT, fontName='Helvetica-Bold', textColor=PRIMARY_COLOR))
        ]
    ]
    
    header_table = Table(header_data, colWidths=[340, 200])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    
    # Horizontal line
    divider = Table([[""]], colWidths=[540], rowHeights=[2])
    divider.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 1.5, PRIMARY_COLOR),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(divider)
    story.append(Spacer(1, 10))
    
    # 5. Patient Profile Info
    story.append(Paragraph("Patient & Screening Information", section_heading))
    
    # Table layout for patient metrics
    inputs = assessment.get('inputs', {})
    cycle_text = "Irregular" if inputs.get('cycle') == 1 else "Regular"
    
    patient_info = [
        [Paragraph("<b>Patient Name:</b>", body_style), Paragraph(user_name, body_style), 
         Paragraph("<b>Age:</b>", body_style), Paragraph(f"{inputs.get('age')} years", body_style)],
        
        [Paragraph("<b>Patient Email:</b>", body_style), Paragraph(user_email, body_style), 
         Paragraph("<b>Height:</b>", body_style), Paragraph(f"{inputs.get('height')} cm", body_style)],
         
        [Paragraph("<b>Calculated BMI:</b>", body_style), Paragraph(f"{inputs.get('bmi')} (Normal: 18.5 - 24.9)", body_style), 
         Paragraph("<b>Weight:</b>", body_style), Paragraph(f"{inputs.get('weight')} kg", body_style)],
         
        [Paragraph("<b>Menstrual Cycle:</b>", body_style), Paragraph(cycle_text, body_style), 
         Paragraph("<b>Cycle Length:</b>", body_style), Paragraph(f"{inputs.get('cycle_length')} days", body_style)]
    ]
    
    info_table = Table(patient_info, colWidths=[100, 170, 90, 180])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 15))
    
    # 6. Risk Prediction Results Banner
    prediction = assessment.get('prediction', {})
    risk_level = prediction.get('risk_level', 'Low')
    probability = prediction.get('probability', 0.0)
    prob_percentage = round(probability * 100, 1)
    
    # Determine card color
    if risk_level == 'High':
        risk_bg = colors.HexColor('#fef2f2')   # Red-50
        risk_text_color = colors.HexColor('#991b1b') # Red-800
        risk_border = colors.HexColor('#fca5a5') # Red-300
    elif risk_level == 'Moderate':
        risk_bg = colors.HexColor('#fffbeb')   # Amber-50
        risk_text_color = colors.HexColor('#92400e') # Amber-800
        risk_border = colors.HexColor('#fcd34d') # Amber-300
    else: # Low
        risk_bg = colors.HexColor('#f0fdf4')   # Green-50
        risk_text_color = colors.HexColor('#166534') # Green-800
        risk_border = colors.HexColor('#86efac') # Green-300
        
    risk_label_style = ParagraphStyle(
        'RiskLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        textColor=risk_text_color,
        alignment=TA_CENTER
    )
    
    risk_desc_style = ParagraphStyle(
        'RiskDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        textColor=colors.HexColor('#4b5563'),
        alignment=TA_CENTER,
        leading=13
    )
    
    # Vitals and symptoms summary
    symptom_list = []
    if inputs.get('weight_gain') == 1: symptom_list.append("Weight Gain")
    if inputs.get('hair_growth') == 1: symptom_list.append("Excess Hair Growth (Hirsutism)")
    if inputs.get('hair_loss') == 1: symptom_list.append("Hair Thinning")
    if inputs.get('skin_darkening') == 1: symptom_list.append("Skin Darkening")
    if inputs.get('pimples') == 1: symptom_list.append("Acne/Pimples")
    
    symptoms_text = ", ".join(symptom_list) if symptom_list else "None Reported"
    
    risk_banner_content = [
        [
            Paragraph(f"<b>PCOS RISK LEVEL:</b> {risk_level.upper()}<br/><br/><font size=28>{prob_percentage}%</font><br/><br/>Probability", risk_label_style),
            Paragraph(f"<b>Health Risk Assessment Summary:</b><br/>"
                      f"The machine learning model predicted a <b>{prob_percentage}%</b> risk of Polycystic Ovary Syndrome (PCOS) based on the inputs provided.<br/><br/>"
                      f"<b>Active Clinical Signs:</b> {symptoms_text}<br/>"
                      f"<b>Lifestyle Habits:</b> Regular Exercise: {'Yes' if inputs.get('reg_exercise') == 1 else 'No'}, High Fast Food Intake: {'Yes' if inputs.get('fast_food') == 1 else 'No'}", risk_desc_style)
        ]
    ]
    
    risk_table = Table(risk_banner_content, colWidths=[180, 360])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), risk_bg),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1, risk_border),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(risk_table)
    story.append(Spacer(1, 15))
    
    # 7. Personalized Health Guidelines
    story.append(Paragraph("Personalized Lifestyle Recommendations", section_heading))
    
    recs = assessment.get('recommendations', {})
    
    rec_table_data = []
    
    # We display structured recommendation blocks
    def make_rec_list(items):
        if not items:
            return Paragraph("Maintain a balanced wellness routine.", body_style)
        html_list = "<br/>".join([f"&bull; {item}" for item in items])
        return Paragraph(html_list, body_style)
        
    rec_table_data.append([Paragraph("<b>Dietary Guidelines</b>", body_bold), make_rec_list(recs.get('diet', []))])
    rec_table_data.append([Paragraph("<b>Physical Activities</b>", body_bold), make_rec_list(recs.get('exercise', []))])
    rec_table_data.append([Paragraph("<b>Stress & Sleep</b>", body_bold), make_rec_list(recs.get('sleep', []) + recs.get('stress', []))])
    rec_table_data.append([Paragraph("<b>Weight & Lifestyle</b>", body_bold), make_rec_list(recs.get('weight', []) + recs.get('lifestyle', []))])
    rec_table_data.append([Paragraph("<b>Clinical Steps</b>", body_bold), make_rec_list(recs.get('medical', []))])
    
    rec_table = Table(rec_table_data, colWidths=[120, 420])
    rec_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#faf5ff')), # Soft light purple/lavender left column
    ]))
    
    # We keep recommendations block together to avoid page break mid-table
    story.append(KeepTogether(rec_table))
    story.append(Spacer(1, 20))
    
    # 8. Disclaimer Footer (Must be kept at the bottom of the page)
    disclaimer_text = (
        "<b>MEDICAL DISCLAIMER:</b> PCOSENSE is an artificial intelligence powered early screening tool "
        "designed for educational and awareness purposes only. This screening result is NOT a medical diagnosis, "
        "nor does it constitute therapeutic advice. Machine Learning outputs can contain statistical errors. "
        "Always consult a licensed gynecologist, endocrinologist, or qualified healthcare professional "
        "for actual diagnostic evaluation, medical testing (including blood hormone panels and pelvic ultrasounds), "
        "and customized treatment plans. Do not start or alter any medical treatments based on this report."
    )
    
    disclaimer_box = Table([[Paragraph(disclaimer_text, disclaimer_style)]], colWidths=[540])
    disclaimer_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT_PINK),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#fecdd3')), # Soft rose border
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(disclaimer_box)
    
    # Build Document
    doc.build(story)
    return output_path
