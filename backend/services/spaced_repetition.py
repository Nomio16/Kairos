from datetime import datetime, timedelta

def calculate_sm2(quality: float, repetitions: int, previous_interval: int, previous_ease_factor: float) -> dict:
    """
    SuperMemo-2 (SM-2) Spaced Repetition Algorithm.
    Quality is 0 (total blackout) to 5 (perfect response).
    """
    if quality >= 3:
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = round(previous_interval * previous_ease_factor)
        repetitions += 1
    else:
        repetitions = 0
        interval = 1

    ease_factor = previous_ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    
    if ease_factor < 1.3:
        ease_factor = 1.3
        
    next_review_date = datetime.utcnow() + timedelta(days=interval)
    
    return {
        "interval_days": interval,
        "repetitions": repetitions,
        "ease_factor": ease_factor,
        "next_review_date": next_review_date.isoformat(),
        "last_reviewed_at": datetime.utcnow().isoformat()
    }
