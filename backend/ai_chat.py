import os
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models import User, ChatMessage
from backend.auth import get_current_active_user
from pydantic import BaseModel
from google import genai

router = APIRouter()

# Read the API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Initialize the GenAI client using the new SDK
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

class ChatRequest(BaseModel):
    message: str

@router.post("/chat", response_model=dict)
async def chat_with_bot(request: ChatRequest, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured.")

    # Save user message
    user_msg = ChatMessage(user_id=current_user.id, message=request.message, is_bot=False)
    db.add(user_msg)
    await db.commit()

    # Simple prompt configuration to guide the AI as a Learning Coach
    system_instruction = "You are a helpful, encouraging Learning Coach for Performova LMS. Keep your answers concise, motivating, and related to learning or professional growth."

    try:
        # We will use gemini-2.5-flash since it's the recommended fast/cheap model for general tasks
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=request.message,
            config=genai.types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7
            )
        )
        ai_text = response.text
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        ai_text = "I'm having a little trouble connecting to my knowledge base right now. Let's try again in a moment!"

    # Save bot message
    bot_msg = ChatMessage(user_id=current_user.id, message=ai_text, is_bot=True)
    db.add(bot_msg)
    await db.commit()

    return {"message": ai_text}


@router.websocket("/ws/chat/{token}")
async def websocket_chat(websocket: WebSocket, token: str, db: AsyncSession = Depends(get_db)):
    # Note: For production, we need a secure way to pass/validate tokens in WebSockets.
    # Currently simplifying it by passing token in path.
    await websocket.accept()
    try:
        # Here we would normally validate the token and get the user.
        # For demonstration of the scaffolding, we assume they are authenticated.
        while True:
            data = await websocket.receive_text()

            # Simple echo or AI logic would go here for real-time streaming
            if client:
                # Example: real-time streaming response from Gemini
                response_stream = client.models.generate_content_stream(
                    model="gemini-2.5-flash",
                    contents=data,
                )
                for chunk in response_stream:
                    if chunk.text:
                         await websocket.send_text(chunk.text)
                await websocket.send_text("[DONE]")
            else:
                 await websocket.send_text("Echo (No API Key): " + data)
                 await websocket.send_text("[DONE]")

    except WebSocketDisconnect:
        print("Client disconnected")
