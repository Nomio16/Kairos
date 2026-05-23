from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter()

# In-memory store for agile marathon game logic
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        self.active_connections[room_id].remote(websocket)

    async def broadcast(self, room_id: str, message: dict):
        for connection in self.active_connections.get(room_id, []):
            await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/marathon/{room_id}")
async def marathon_endpoint(websocket: WebSocket, room_id: str):
    """
    WebSocket endpoint for real-time multiplayer 'Language Marathons'.
    Clients connect to a `room_id` matching their public or private classroom setting.
    """
    await manager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Distribute incoming points/progress/XP to all clients to update the leaderboard
            await manager.broadcast(room_id, {"type": "marathon_update", "event": data})
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
        await manager.broadcast(room_id, {"type": "player_left", "message": "A player has left the marathon"})
