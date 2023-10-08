from typing import Any
import logging
import psycopg2


class Database:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname="postgres",
            user="myuser",
            password="mypassword",
            host="localhost"
        )

    def initialize_user(self, username: str):
        with self.conn.cursor() as cur:
            cur.execute("SELECT username FROM Users WHERE username = %s", (username,))
            user = cur.fetchone() if cur.rowcount > 0 else None
            if user is None:
                cur.execute("INSERT INTO Users (username) VALUES (%s)", (username,))
                self.conn.commit()
                user = (username.lower(),)
            return user

    def get_created_tasks(self, username: str):
        with self.conn.cursor() as cur:
            try:
                cur.execute("""SELECT T.id, T.content, T.status, T.deadline, T.priority
                               FROM Tasks T
                               WHERE T.created_by = %s
                               and not exists (select null from User_Tasks UT where T.id = UT.task_id)""",
                            (username.lower(),))
                our_tasks = cur.fetchall() if cur.rowcount > 0 else []
                return our_tasks
            except Exception as e:
                print(f"An error occurred: {e}")
                self.conn.rollback()

    # get tasks for us from someone by @username with usernames
    def get_received_tasks(self, username: str):
        with self.conn.cursor() as cur:
            cur.execute("""SELECT T.id, T.content, T.status, T.deadline, T.priority, T.created_by
                            FROM Tasks T
                            JOIN User_Tasks UT ON T.id = UT.task_id
                            WHERE UT.username = %s""",
                        (username.lower(),)
                        )
            tasks_for_us = cur.fetchall() if cur.rowcount > 0 else []
            print("our_tasks:", tasks_for_us)
            return tasks_for_us

    # get tasks from us to someone by @username with usernames
    def get_delegated_tasks(self, username: str):
        with self.conn.cursor() as cur:
            cur.execute("""SELECT T.id, T.content, T.status, T.deadline, T.priority, UT.username
                           FROM Tasks T
                           JOIN User_Tasks UT ON T.id = UT.task_id
                           WHERE t.created_by = %s""",
                        (username.lower(),)
                        )
            tasks_for_someone = cur.fetchall() if cur.rowcount > 0 else []
            return tasks_for_someone

    def create_user(self, username: str):
        with self.conn.cursor() as cur:
            cur.execute(
                "INSERT INTO Users (username) VALUES (%s)",
                (username.lower(),)
            )
            self.conn.commit()

    def create_task(self, created_by, status, content, deadline, priority):
        with self.conn.cursor() as cur:
            cur.execute(
                "INSERT INTO Tasks (created_by, status, content, deadline, priority)"
                "VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (created_by, status, content, deadline, priority))
            self.conn.commit()

    def delete_task(self, task_id):
        with self.conn.cursor() as cur:
            cur.execute("DELETE FROM Tasks WHERE id = %s", (task_id,))
            cur.execute("DELETE FROM user_tasks WHERE task_id = %s", (task_id,))
            self.conn.commit()

    def update_task(self, task_id, status, content, deadline_date, priority):
        with self.conn.cursor() as cur:
            cur.execute("UPDATE Tasks SET "
                        "status = (%s), content = (%s), deadline = (%s), priority = (%s) "
                        "WHERE id = (%s)",
                        (self, status, content, deadline_date, priority, task_id))
            self.conn.commit()

    def delegate_task(self, task_id, username: str):
        with self.conn.cursor() as cur:
            cur.execute("SELECT username FROM users WHERE username = %s", (username.lower(),))
            user = cur.fetchone()
            if user is None:
                return {"message": "User does not exist"}
            else:
                cur.execute(
                    "INSERT INTO User_Tasks (task_id, username) VALUES (%s, %s)",
                    (task_id, username.lower()))
                self.conn.commit()
                return {"message": "Task delegated successfully"}

    def change_status_task(self, task_id, status=True):
        with self.conn.cursor() as cur:
            cur.execute("UPDATE Tasks SET status = (%s) WHERE id = (%s)",
                        (status, task_id))
            self.conn.commit()
