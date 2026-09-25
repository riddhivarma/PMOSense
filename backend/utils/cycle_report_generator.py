# backend/utils/cycle_report_generator.py
"""
PMOSense - Menstrual Cycle History PDF Generator
Generates a structured, professional 6-Month Cycle & Ovulatory Health Report
using ReportLab.
"""

import io
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def generate_cycle_pdf_report(user_name, user_email, user_info, cycles, stats, output_path):
    """
    Generates a 6-month Menstrual Cycle History PDF report.
    - user_name: Patient full name
    - user_email: Patient email
    - user_info: dict with age, blood_group, etc.
    - cycles: list of cycle records
    - stats: summary statistics dict
    - output_path: file path or BytesIO buffer
    """
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    story = []
    
    # 1. Colors Palette (matching PMOSense Theme)
    PRIMARY_COLOR = colors.HexColor('#db2777')   # Soft Pink / Rose
    SECONDARY_COLOR = colors.HexColor('#4f46e5') # Indigo
    DARK_TEXT = colors.HexColor('#1f2937')       # Slate-800
    MUTED_TEXT = colors.HexColor('#4b5563')      # Slate-600
    BG_LIGHT_PINK = colors.HexColor('#fdf2f8')   # Rose-50
    BORDER_COLOR = colors.HexColor('#e5e7eb')    # Gray-200
    
    # 2. Typography Styles
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=PRIMARY_COLOR,
        alignment=TA_LEFT
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=MUTED_TEXT,
        spaceAfter=12
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=SECONDARY_COLOR,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'ReportBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=DARK_TEXT,
        leading=13
    )
    
    body_bold = ParagraphStyle(
        'ReportBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    table_header = ParagraphStyle(
        'TableHeader',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=colors.white,
        fontSize=9
    )
    
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        textColor=colors.HexColor('#6b7280'),
        alignment=TA_CENTER,
        leading=11
    )
    
    # 3. Header Section (Logo & Platform Branding)
    header_data = [
        [
            Paragraph("<b>PMOSense</b>", title_style),
            Paragraph(f"<b>Generated:</b> {datetime.datetime.utcnow().strftime('%B %d, %Y')}<br/><b>Document:</b> 6-Month Cycle Log", ParagraphStyle('HRight', parent=body_style, alignment=TA_RIGHT, textColor=MUTED_TEXT))
        ],
        [
            Paragraph("Menstrual Cycle & Ovulatory Health Report (6-Month Log)", subtitle_style),
            Paragraph("Confidential Medical Screening Document", ParagraphStyle('SubRight', parent=body_style, alignment=TA_RIGHT, fontSize=8, textColor=PRIMARY_COLOR))
        ]
    ]
    header_table = Table(header_data, colWidths=[340, 200])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))
    
    # 4. Patient Information Block
    age_val = user_info.get('age', 'N/A')
    blood_val = user_info.get('blood_group', 'Not set')
    
    patient_data = [
        [
            Paragraph(f"<b>Patient Name:</b> {user_name}", body_style),
            Paragraph(f"<b>Age:</b> {age_val} yrs", body_style),
            Paragraph(f"<b>Blood Group:</b> {blood_val}", body_style)
        ],
        [
            Paragraph(f"<b>Email:</b> {user_email}", body_style),
            Paragraph(f"<b>Monitoring Period:</b> Last 6 Months", body_style),
            Paragraph(f"<b>Records Count:</b> {len(cycles)} cycle(s)", body_style)
        ]
    ]
    patient_table = Table(patient_data, colWidths=[220, 160, 160])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#f1f5f9')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(patient_table)
    story.append(Spacer(1, 14))
    
    # 5. Clinical Summary KPI Highlights (6-Month Summary)
    story.append(Paragraph("6-Month Cycle Health Summary", section_heading))
    
    avg_len = stats.get('avg_cycle_length')
    avg_len_text = f"{avg_len} Days" if avg_len else "Insufficient Data (<2 logs)"
    regularity_text = stats.get('cycle_regularity', 'Evaluating')
    
    # Compute dominant flow & avg pain from logged cycles
    if cycles:
        flows = [c.get('flow', 'Medium') for c in cycles]
        dominant_flow = max(set(flows), key=flows.count) if flows else "Medium"
        pains = [float(c.get('pain_level', 2)) for c in cycles if c.get('pain_level') is not None]
        avg_pain = f"{(sum(pains) / len(pains)):.1f} / 5" if pains else "2.0 / 5"
        durations = [int(c.get('period_duration', 5)) for c in cycles if c.get('period_duration') is not None]
        avg_duration = f"{(sum(durations) / len(durations)):.1f} Days" if durations else "5 Days"
    else:
        dominant_flow = "N/A"
        avg_pain = "N/A"
        avg_duration = "N/A"
        
    summary_data = [
        [
            Paragraph("<b>Metric</b>", table_header),
            Paragraph("<b>Observed Value</b>", table_header),
            Paragraph("<b>Clinical Benchmark (Rotterdam / NIH)</b>", table_header)
        ],
        [
            Paragraph("Average Cycle Length", body_bold),
            Paragraph(avg_len_text, body_style),
            Paragraph("Typical: 21 - 35 days (Cycles >35 days suggest Oligomenorrhea)", body_style)
        ],
        [
            Paragraph("Cycle Regularity Status", body_bold),
            Paragraph(f"<b>{regularity_text}</b>", body_style),
            Paragraph("Variability > 7 days or skipping cycles flags ovulatory dysfunction", body_style)
        ],
        [
            Paragraph("Average Bleeding Duration", body_bold),
            Paragraph(avg_duration, body_style),
            Paragraph("Typical: 3 - 7 days", body_style)
        ],
        [
            Paragraph("Dominant Flow Intensity", body_bold),
            Paragraph(dominant_flow, body_style),
            Paragraph("Light, Medium, or Heavy flow pattern", body_style)
        ],
        [
            Paragraph("Average Pain Level (1 to 5)", body_bold),
            Paragraph(avg_pain, body_style),
            Paragraph("Dysmenorrhea rating (1: Mild/None to 5: Severe/Debilitating)", body_style)
        ]
    ]
    summary_table = Table(summary_data, colWidths=[150, 130, 260])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SECONDARY_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 14))
    
    # 6. Chronological Cycle History Table
    story.append(Paragraph("Chronological Menstrual Cycle History", section_heading))
    
    cycle_headers = [
        Paragraph("<b>Start Date</b>", table_header),
        Paragraph("<b>End Date</b>", table_header),
        Paragraph("<b>Duration</b>", table_header),
        Paragraph("<b>Flow</b>", table_header),
        Paragraph("<b>Pain (1-5)</b>", table_header),
        Paragraph("<b>Pads/Day</b>", table_header),
        Paragraph("<b>Symptoms & Issues Logged</b>", table_header)
    ]
    
    cycle_rows = [cycle_headers]
    
    if not cycles:
        cycle_rows.append([
            Paragraph("No cycle records logged in this timeframe.", body_style),
            "", "", "", "", "", ""
        ])
    else:
        # Sort descending by start_date for chronological display
        sorted_cycles = sorted(cycles, key=lambda x: str(x.get('start_date', '')), reverse=True)
        for c in sorted_cycles:
            s_date = str(c.get('start_date', 'N/A'))
            e_date = str(c.get('end_date', 'Ongoing')) if c.get('end_date') else "Ongoing"
            dur = f"{c.get('period_duration', 5)} days"
            fl = str(c.get('flow', 'Medium'))
            pn = f"{c.get('pain_level', 2)} / 5"
            pads = str(c.get('pads_per_day', 3))
            notes = str(c.get('additional_issues', '')).strip() or "None reported"
            
            cycle_rows.append([
                Paragraph(s_date, body_style),
                Paragraph(e_date, body_style),
                Paragraph(dur, body_style),
                Paragraph(fl, body_style),
                Paragraph(pn, body_style),
                Paragraph(pads, body_style),
                Paragraph(notes, body_style)
            ])
            
    cycle_table = Table(cycle_rows, colWidths=[68, 68, 55, 55, 54, 55, 185])
    cycle_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#fff7ed') if not cycles else colors.white])
    ]))
    story.append(cycle_table)
    story.append(Spacer(1, 14))
    
    # 7. Clinical Notes for Consulting Gynecologist / Physician
    story.append(Paragraph("Clinical Reference Notes for Healthcare Providers", section_heading))
    clinical_note_html = (
        "<b>Rotterdam Diagnostic Consensus Note:</b> Menstrual irregularities, particularly oligomenorrhea "
        "(cycle intervals &gt; 35 days) or secondary amenorrhea (&gt; 90 days), serve as primary diagnostic criteria "
        "for Polyendocrine / Polycystic Morphology Ovarian Syndrome (PMOS/PCOS). This self-reported tracking document provides "
        "longitudinal cycle variance and dysmenorrhea severity metrics to assist clinicians in evaluating ovulatory "
        "status and formulating personalized lifestyle or hormonal therapy plans."
    )
    story.append(Paragraph(clinical_note_html, body_style))
    story.append(Spacer(1, 14))
    
    # 8. Disclaimer
    story.append(Paragraph(
        "<b>MEDICAL DISCLAIMER:</b> This cycle history report is compiled from patient self-logged entries on the "
        "PMOSense Platform for informational and consultation support purposes only. It does not replace comprehensive "
        "in-person clinical examination, transvaginal pelvic ultrasonography, or endocrine serum biomarker assays.",
        disclaimer_style
    ))
    
    doc.build(story)
