from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()

os.makedirs("uploads", exist_ok=True)

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    filepath = f"uploads/{file.filename}"

    with open(filepath, "wb") as f:
        f.write(await file.read())

    return {
        "status": "success",
        "filename": file.filename
    }