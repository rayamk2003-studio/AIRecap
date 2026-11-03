from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()

# Create uploads folder automatically
os.makedirs("uploads", exist_ok=True)

# Templates
templates = Jinja2Templates(directory="templates")

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    filepath = os.path.join("uploads", file.filename)

    with open(filepath, "wb") as f:
        contents = await file.read()
        f.write(contents)

    return {
        "status": "success",
        "filename": file.filename,
        "saved_to": filepath
    }


@app.get("/health")
async def health():
    return {
        "status": "ok"
    }
