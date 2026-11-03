from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

os.makedirs("uploads", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def home():
    return FileResponse("templates/index.html")


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    filepath = os.path.join("uploads", file.filename)

    with open(filepath, "wb") as f:
        f.write(await file.read())

    return {
        "status": "success",
        "filename": file.filename
    }


@app.get("/health")
async def health():
    return {"status": "ok"}