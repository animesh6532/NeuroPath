from fastapi import APIRouter

router = APIRouter()

@router.post("/proctoring/analyze-events")
async def analyze_events(data: dict):
    from backend.app.proctoring.behavior_rules import cheating_risk
    return cheating_risk(data)