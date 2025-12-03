from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="AI Summarizer API")

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Summarization Pipeline
# Using a smaller model for faster CPU inference
MODEL_NAME = "sshleifer/distilbart-cnn-12-6" 
# Alternative: "facebook/bart-large-cnn" (better quality, slower)
# Alternative: "t5-small" (very fast, lower quality)

print("Loading model... this may take a while first time.")
summarizer = pipeline("summarization", model=MODEL_NAME)
print("Model loaded.")

class SummarizeRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "AI Summarizer API is running"}

@app.post("/summarize")
def summarize_text(request: SummarizeRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    try:
        # Limit input length to avoid memory issues on free tier/local cpu
        input_text = request.text[:1024 * 4] 
        
        summary_output = summarizer(input_text, max_length=150, min_length=30, do_sample=False)
        summary_text = summary_output[0]['summary_text']
        
        return {"summary": summary_text}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
