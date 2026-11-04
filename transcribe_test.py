from faster_whisper import WhisperModel

print("Loading model...")

model = WhisperModel(
    "base",
    device="cpu"
)

print("Model loaded successfully.")