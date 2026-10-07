import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

load_dotenv()

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


@app.get("/")
async def home():
    return FileResponse("static/index.html")


@app.get("/token")
async def get_token(language: str = "en"):

    if language == "pl":
        starting_language = "Polish"
    elif language == "de":
        starting_language = "German"
    else:
        starting_language = "English"

    instructions = f"""
You are a voice assistant conducting a short interview about the user's preferences
for a weekend trip.

Start the conversation in {starting_language}.

The user may change language during the conversation.
If the user starts speaking in another language, naturally continue the conversation
in that language.

You support Polish, English and German.

Your goal is to collect:
1. preferred type of destination,
2. budget,
3. preferred transport,
4. accommodation preference,
5. preferred activities.

Ask one question at a time.

If the answer is incomplete or unclear, ask a short follow-up question.

Stay strictly within the topic of the weekend trip interview.

If the user asks about something unrelated to the trip, do not answer
the unrelated question.

Briefly explain that you can only discuss topics related to the trip
and immediately return to the interview.

Related side questions about travel may be answered briefly
if they help complete the interview.

Do not finish the conversation until all required information
has been collected.

Keep your responses short, natural and conversational.
"""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    data = {
        "expires_after": {
            "anchor": "created_at",
            "seconds": 600
        },
        "session": {
            "type": "realtime",
            "model": "gpt-realtime",
            "instructions": instructions,
            "audio": {
                "input": {
                    "transcription": {
                        "model": "gpt-4o-mini-transcribe"
                    },
                    "turn_detection": {
                        "type": "server_vad",
                        "silence_duration_ms": 1500
                    }
                }
            }
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/realtime/client_secrets",
            headers=headers,
            json=data,
        )

    return response.json()


@app.post("/summary")
async def create_summary(request: Request):
    data = await request.json()

    conversation = data.get("conversation", [])

    transcript = "\n".join(
        f"{item['role'].upper()}: {item['text']}"
        for item in conversation
    )

    summary_prompt = f"""
Create a short and clear summary of the following conversation
about a weekend trip.

First determine the main language used by the user in the conversation.

Write the entire summary in that language.

If the conversation is mainly in Polish, use this format:

Cel / rodzaj miejsca: ...
Budżet: ...
Transport: ...
Nocleg: ...
Preferowane aktywności: ...

If the conversation is mainly in English, use this format:

Destination/type of place: ...
Budget: ...
Transport: ...
Accommodation: ...
Preferred activities: ...

If the conversation is mainly in German, use this format:

Reiseziel / Art des Ortes: ...
Budget: ...
Transport: ...
Unterkunft: ...
Bevorzugte Aktivitäten: ...

Return plain text only.
Do not use Markdown, bold text, asterisks or tables.

Do not invent missing information.

If information was not provided, state that it was not provided
using the same language as the summary.

Conversation:
{transcript}
"""

    payload = {
        "model": "gpt-5.6-luna",
        "input": summary_prompt
    }

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/responses",
            headers=headers,
            json=payload,
        )

    result = response.json()

    if response.status_code != 200:
        return {
            "error": result
        }

    summary = ""

    for output in result.get("output", []):
        for content in output.get("content", []):
            if content.get("type") == "output_text":
                summary += content.get("text", "")

    return {
        "summary": summary
    }