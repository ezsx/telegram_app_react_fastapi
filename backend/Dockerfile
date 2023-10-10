FROM python:3.10.8

WORKDIR /app

COPY ./requirements.txt /requirements.txt
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r /requirements.txt

COPY ./app/ /app/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${SERVICE_PORT}", "--reload"]