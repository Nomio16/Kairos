.PHONY: front back app

front:
	cd frontend && npm run dev

back:
	cd backend && python3 -m uvicorn main:app --reload

app:
	$(MAKE) -j2 back front
