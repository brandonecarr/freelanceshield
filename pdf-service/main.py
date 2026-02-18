from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import io
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FreelanceShield PDF Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/extract")
async def extract_text(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        if not (file.filename and file.filename.lower().endswith(".pdf")):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are supported."
            )

    contents = await file.read()
    file_size = len(contents)
    logger.info(f"Received file: {file.filename}, size: {file_size} bytes")

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File too large. Maximum size is 10MB."
        )

    if file_size == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        pdf_stream = io.BytesIO(contents)
        extracted_pages = []
        page_count = 0

        with pdfplumber.open(pdf_stream) as pdf:
            page_count = len(pdf.pages)

            if page_count == 0:
                raise HTTPException(
                    status_code=422,
                    detail="PDF has no pages."
                )

            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_pages.append(text)

        full_text = "\n\n".join(extracted_pages).strip()

        if not full_text:
            raise HTTPException(
                status_code=422,
                detail={
                    "error": "no_text_extractable",
                    "message": "We couldn't extract text from this PDF. Try uploading a text-based PDF, or paste your contract text directly."
                }
            )

        logger.info(f"Extracted {len(full_text)} characters from {page_count} pages")

        return {
            "success": True,
            "text": full_text,
            "page_count": page_count,
            "char_count": len(full_text)
        }

    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e).lower()

        if "encrypted" in error_msg or "password" in error_msg:
            raise HTTPException(
                status_code=422,
                detail={
                    "error": "encrypted_pdf",
                    "message": "This PDF is password-protected. Please remove the password and re-upload."
                }
            )

        logger.error(f"PDF extraction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=422,
            detail={
                "error": "extraction_failed",
                "message": "We couldn't process this PDF. Please ensure it's a valid, non-corrupted PDF file."
            }
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
