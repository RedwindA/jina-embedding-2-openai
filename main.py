from fastapi import FastAPI, HTTPException, Request
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

JINA_API_BASE_URL = os.getenv("JINA_API_BASE_URL", "https://api.jina.ai/v1")
JINA_API_KEY = os.getenv("JINA_API_KEY")
MODEL = os.getenv("MODEL", "jina-embeddings-v3")
TASK = os.getenv("TASK", "retrieval.query")
LATE_CHUNKING = os.getenv("LATE_CHUNKING", "false").lower() == "true"
DIMENSIONS = int(os.getenv("DIMENSIONS", 1024))
HOST = os.getenv("HOST", "0.0.0.0")

@app.post("/v1/embeddings")
async def embeddings(request: Request):
    data = await request.json()
    # Extract API key from headers or use environment variable
    auth_header = request.headers.get("Authorization", "")
    header_api_key = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else ""
    api_key = JINA_API_KEY or header_api_key
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": MODEL,
        "task": TASK,
        "late_chunking": LATE_CHUNKING,
        "dimensions": DIMENSIONS,
        "embedding_type": "float",
        "input": data.get("input"),
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{JINA_API_BASE_URL}/embeddings", json=payload, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=int(os.getenv("PORT", 4000)))