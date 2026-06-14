.PHONY: docker-up docker-down api-install api-migrate api-dev web-install web-dev test

docker-up:
	cd docker && docker compose up -d

docker-down:
	cd docker && docker compose down

api-install:
	cd apps/api && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt

api-migrate:
	cd apps/api && . .venv/bin/activate && alembic upgrade head

api-dev:
	cd apps/api && . .venv/bin/activate && uvicorn app.main:app --reload --port 8000

web-install:
	cd apps/web && npm install

web-dev:
	cd apps/web && npm run dev

test:
	cd apps/api && . .venv/bin/activate && pytest -q
