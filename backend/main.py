from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import openai
import os

app = FastAPI()

# CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    mode = data.get("mode", "fun")
    message = data.get("message")
    prompt = ""
    if mode == "fun":
        prompt = (
            "Pretend you are Albert Einstein in a playful mood. Answer questions with wit, fun facts, "
            "and references to physics and life. Here is the question:\n"
        )
    else:
        prompt = (
            "Pretend you are Albert Einstein, Nobel Prize-winning physicist. Respond in a serious, insightful scientific tone. Here is the question:\n"
        )
    full_prompt = f"{prompt}{message}"
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": prompt},
                  {"role": "user", "content": message}]
    )
    reply = completion.choices[0].message.content
    return {"reply": reply}
