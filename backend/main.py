from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import openai
import os

load_dotenv()

app = FastAPI()

# CORS setup for frontend/backend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict this!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create OpenAI client with env API key
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    mode = data.get("mode", "fun")
    message = data.get("message", "")

    if mode == "fun":
        prompt = (
            "Pretend you are Albert Einstein in a playful mood. "
            "Answer questions with wit, fun facts, and references to physics and life."
        )
    else:
        prompt = (
            "Pretend you are Albert Einstein, Nobel Prize-winning physicist. "
            "Respond in a serious, insightful scientific tone."
        )

    # Compose messages for chat
    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": message}
    ]

    # Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.8 if mode == "fun" else 0.4
    )
    reply = response.choices[0].message.content
    return {"reply": reply}
