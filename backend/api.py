import random
from pydantic import BaseModel
from pathlib import Path

from fastapi import APIRouter, FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import starlette.status as status

import uvicorn

app = FastAPI()
router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

class JoinBody(BaseModel):
    roomId: str
    playerId: str

class AnswerBody(BaseModel):
    playerId: str
    point: str
    answer: str

class PlayerBody(BaseModel):
    playerId: str

@app.get("/", include_in_schema=False)
def lobbyRedirect():
    #редирект в лобби
    return FileResponse(FRONTEND_DIR / "html" / "lobby.html")

app.get("/game/test", include_in_schema=False)
def gameRedirect():
    #редирект в игровой html
    return FileResponse(FRONTEND_DIR / "html" / "game.html")

#все доступные румы
@app.get("/room/get")
def getRooms():
    #делаем запрос в бд и получаем все доступные группы и их участников
    pass

#вступить в руму
@app.post("/room/join")
def joinToRoom(body: JoinBody):
    #приписваем id румы к игроку
    pass

#создать руму
@app.get("/room/create")
def createRoom(playerId: str):
    #новая запись бд
    pass

#покинуть руму
@app.post("/room/leave")
def leaveRoom(body: JoinBody):
    #уписываем id румы от игрока
    pass

#запустить каточку
@app.post("/room/start")
def startRoom(roomId: str):
    #создаём мапу и всех участников редиректим
    pass

@app.get("/game/quest/pull")
def pullQuest(point: str):
    #получить вопрос
    pass

@app.post("/game/quest/push")
def pushAnswer(body: AnswerBody):
    #дать ответ
    pass

@app.get("/game/interact/dice")
def throwDice():
    #рандом число от 1 до 6
    return {"dice": random.randint(1, 6)}

#прикручиваем директорию чтоб она раздавалась по корневому пути
app.mount("/", StaticFiles(directory=FRONTEND_DIR), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)