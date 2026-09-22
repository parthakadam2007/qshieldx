FROM python:3.14-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

ENV UV_LINK_MODE=copy

RUN apt-get update \
	&& apt-get install -y --no-install-recommends libatomic1 \
	&& rm -rf /var/lib/apt/lists/*

# Install dependencies first for Docker layer caching
COPY pyproject.toml uv.lock ./
COPY ./src ./src
COPY README.md ./README.md

RUN uv sync --frozen --no-dev

# Copy application
COPY ./ai_service_demo /app/ai_service_demo
COPY ./common /app/common
COPY ./workers /app/workers
COPY ./app /app/app

# Generate the Prisma Client used by the API at import time
RUN DATABASE_URL=postgresql://localhost/qshieldx DIRECT_URL=postgresql://localhost/qshieldx uv run prisma generate --schema=/app/ai_service_demo/database/schema.prisma

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "8000"]