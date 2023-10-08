FROM python:3.11-slim

WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/pip

COPY ./requirements.txt ./
RUN pip install -r requirements.txt
RUN pip install tensorboard jupyter geemap geehydro
COPY ./src ./src
EXPOSE 8080


