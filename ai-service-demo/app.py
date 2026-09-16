from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import json
from .issue import create_github_issue

load_dotenv()

app = FastAPI(
    title="My API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React/Vite
        "http://localhost:3000",  # Next.js / React
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/make_isse")
async def root():
        # Load your CBOM
    with open(
        "D://qshieldx//cbom.json",
        "r",
        encoding="utf-8"
    ) as file:

        seed_cbom = json.load(file)
    create_github_issue(seed_cbom)
    return {"message": "Hello World"}



