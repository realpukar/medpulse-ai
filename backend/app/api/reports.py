"""
MEDPULSE AI — AI Medical Report Analyzer Endpoints
File upload (PDF), text extraction, biomarker entity extraction, and layman explanations.
"""

from typing import Optional, List, Dict
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.patient import Patient
from app.models.report import MedicalReport
from app.services.report_analyzer import report_analyzer
from app.schemas.report import (
    ReportAnalysisResponse,
    TextReportAnalysisRequest
)

router = APIRouter(prefix="/reports", tags=["Medical Reports"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 # 10 MB limit

@router.post("/upload", response_model=ReportAnalysisResponse)
async def upload_medical_report_pdf(
    file: UploadFile = File(...),
    patient_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    # Validation: filename & extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected.")

    if not file.filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(
            status_code=400,
            detail="Unsupported format. Please upload a standard clinical PDF or TXT report."
        )

    # Read bytes with size protection
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds the 10 MB safety threshold."
        )

    # Extract text
    if file.filename.lower().endswith('.pdf'):
        try:
            extracted_text = report_analyzer.extract_text_from_pdf_bytes(contents)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to parse PDF document: {str(e)}")
    else:
        try:
            extracted_text = contents.decode('utf-8', errors='ignore')
        except Exception:
            raise HTTPException(status_code=422, detail="Failed to decode text file contents.")

    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Extracted document text was empty or unreadable scanned image."
        )

    # Analyze extracted clinical content
    analysis = report_analyzer.analyze_report_text(extracted_text, filename=file.filename)

    # Persist in DB
    report_record = MedicalReport(
        patient_id=patient_id,
        filename=file.filename,
        file_type="PDF" if file.filename.lower().endswith('.pdf') else "TXT",
        extracted_text=extracted_text[:10000], # Store up to 10k chars for privacy/storage
        structured_data=[b.model_dump() for b in analysis.biomarkers_detected],
        summary=analysis.layman_summary,
        risk_level=analysis.overall_health_risk
    )
    db.add(report_record)
    db.commit()
    db.refresh(report_record)

    analysis.report_id = report_record.id
    return analysis

@router.post("/analyze-text", response_model=ReportAnalysisResponse)
def analyze_text_report(
    req: TextReportAnalysisRequest,
    db: Session = Depends(get_db)
):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Report text cannot be blank.")

    analysis = report_analyzer.analyze_report_text(req.text, filename=req.report_name or "Clinical_Report.txt")

    if req.patient_id:
        report_record = MedicalReport(
            patient_id=req.patient_id,
            filename=req.report_name or "Manual_Entry_Report.txt",
            file_type="TEXT",
            extracted_text=req.text[:10000],
            structured_data=[b.model_dump() for b in analysis.biomarkers_detected],
            summary=analysis.layman_summary,
            risk_level=analysis.overall_health_risk
        )
        db.add(report_record)
        db.commit()
        db.refresh(report_record)
        analysis.report_id = report_record.id

    return analysis

@router.get("/samples", response_model=List[Dict[str, str]])
def get_sample_clinical_reports():
    return report_analyzer.get_sample_reports()
