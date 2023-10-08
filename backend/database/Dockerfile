FROM postgres:16

ENV POSTGRES_USER myuser
ENV POSTGRES_PASSWORD mypassword

EXPOSE 5432

CMD ["postgres", "-D", "/var/lib/postgresql/data"]

# docker build -t my-postgres .

# docker run --name my-postgres-container -p 5432:5432 -d my-postgres