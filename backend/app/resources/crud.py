"""
SUMMARY:
The provided code is the server part of an application for tracking and distributing tasks in a Telegram mini app.
It involves interacting with a database to perform various operations related to users and tasks.
"""

from psycopg_pool import AsyncConnectionPool
from psycopg import Cursor
from core.config import config as cfg

"""
The pool object creates a pool of connects.
This ensures that every user who comes to us will be served asynchronously
"""

pool = AsyncConnectionPool(cfg.DB_URL, open=False, max_size=cfg.DB_POOL_SIZE_MAX, timeout=cfg.DB_POOL_TIMEOUT)

"""
The get_pool_cur is function decorator. It is a wrapper function that provides a database
connection and cursor to the decorated function. This decorator ensures that a connection
is acquired from the pool, a cursor is created, and the connection is released after the
function is executed.
"""


def get_pool_cur(func):
    async def _inner_(*args, **kwargs):
        async with pool.connection() as conn:
            cursor = conn.cursor()
            return await func(cursor, *args, **kwargs)

    return _inner_


"""
The init_db function creates the necessary tables in the database if they don't already exist.
It executes a series of CREATE TABLE statements for the Users, Tasks, and User_Tasks tables.
Finally, it commits the changes to the database. 
"""


@get_pool_cur
async def init_db(cur: Cursor):
    await cur.execute("""CREATE TABLE IF NOT EXISTS Users(
    username VARCHAR(255) PRIMARY KEY not null)""")

    await cur.execute("""CREATE TABLE IF NOT EXISTS Tasks (
    id SERIAL PRIMARY KEY,
    created_by VARCHAR(255) REFERENCES Users(username),
    status bool,
    content TEXT,
    deadline VARCHAR(255),
    priority INT)""")

    await cur.execute("""CREATE TABLE IF NOT EXISTS User_Tasks (
    username  VARCHAR(255) REFERENCES Users(username),
    task_id INT REFERENCES Tasks(id))
    """)

    await cur.execute("COMMIT")


"""
The initialize_user function checks if a user with the given username already exists in the Users table.
If not, it inserts a new user into the table and commits the change. It returns the user information, if you need it.
"""


@get_pool_cur
async def initialize_user(cur: Cursor, username: str):
    await cur.execute("SELECT username FROM Users WHERE username = %s", (username.lower(),))
    user = await cur.fetchone() if cur.rowcount > 0 else None
    if user is None:
        await cur.execute("INSERT INTO Users (username) VALUES (%s)", (username.lower(),))
        await cur.execute("COMMIT")
        user = (username.lower(),)
    return user


"""
The get_created_tasks function retrieves tasks created by a specific user from the Tasks table. It uses a SELECT
statement with a WHERE clause to filter tasks based on the created_by column and the absence of corresponding entries
in the User_Tasks table. The function returns the fetched tasks. (This function will return only the records created
by us, if the record was delegated to someone, then it will be skipped)
"""


@get_pool_cur
async def get_created_tasks(cur: Cursor, username: str):
    try:
        await cur.execute("""SELECT T.id, T.content, T.status, T.deadline, T.priority
                               FROM Tasks T
                               WHERE T.created_by = %s
                               and not exists (select null from User_Tasks UT where T.id = UT.task_id)""",
                          (username.lower(),))
        our_tasks = (await cur.fetchall()) if cur.rowcount > 0 else []
        return our_tasks
    except Exception as e:
        print(f"An error occurred: {e}")
        await cur.execute("ROLLBACK")


"""
The get_received_tasks function retrieves tasks received by a specific user from the Tasks table.
It uses a SELECT statement with a JOIN clause to retrieve tasks that have corresponding entries in the User_Tasks table
with the given username. The function returns the fetched tasks.
"""


@get_pool_cur
async def get_received_tasks(cur: Cursor, username: str):
    await cur.execute("""SELECT T.id, T.content, T.status, T.deadline, T.priority, T.created_by
                            FROM Tasks T
                            JOIN User_Tasks UT ON T.id = UT.task_id
                            WHERE UT.username = %s""",
                      (username.lower(),)
                      )
    tasks_for_us = (await cur.fetchall()) if cur.rowcount > 0 else []
    return tasks_for_us


"""
The get_delegated_tasks function retrieves tasks delegated by a specific user from the Tasks table. It uses a SELECT 
statement with a JOIN clause to retrieve tasks that have corresponding entries in the User_Tasks table with the given
username as the created_by value. The function returns the fetched tasks.
"""


@get_pool_cur
async def get_delegated_tasks(cur: Cursor, username: str):
    await cur.execute("""SELECT T.id, T.content, T.status, T.deadline, T.priority, UT.username
                           FROM Tasks T
                           JOIN User_Tasks UT ON T.id = UT.task_id
                           WHERE t.created_by = %s""",
                      (username.lower(),)
                      )
    tasks_for_someone = (await cur.fetchall()) if cur.rowcount > 0 else []
    return tasks_for_someone


"""
The create_user function inserts a new user into the Users table with the given username.
It commits the change to the database.
"""


@get_pool_cur
async def create_user(cur: Cursor, username: str):
    await cur.execute(
        "INSERT INTO Users (username) VALUES (%s)",
        (username.lower(),)
    )
    await cur.execute("COMMIT")


"""
The create_task function inserts a new task into the Tasks table with the given values for created_by, status, content,
deadline, and priority. It uses the RETURNING clause to retrieve the generated task ID. It commits the change and
returns the task ID.
"""


@get_pool_cur
async def create_task(cur: Cursor, created_by, status, content, deadline, priority):
    await cur.execute(
        "INSERT INTO Tasks (created_by, status, content, deadline, priority)"
        "VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (created_by.lower(), status, content, deadline, priority))
    await cur.execute("COMMIT")


"""
The delete_task function deletes a task from the Tasks table with the given task ID. 
It also deletes corresponding entries from the User_Tasks table. It commits the changes to the database.
"""


@get_pool_cur
async def delete_task(cur: Cursor, task_id):
    await cur.execute("DELETE FROM Tasks WHERE id = %s", (task_id,))
    await cur.execute("DELETE FROM user_tasks WHERE task_id = %s", (task_id,))
    await cur.execute("COMMIT")


"""
The update_task function updates the details of a task in the Tasks table with the given task ID. It updates the status,
content, deadline, and priority columns with the provided values. It commits the change to the database.
"""


@get_pool_cur
async def update_task(cur: Cursor, task_id, status, content, deadline_date, priority):
    await cur.execute("UPDATE Tasks SET "
                      "status = (%s), content = (%s), deadline = (%s), priority = (%s) "
                      "WHERE id = (%s)",
                      (status, content, deadline_date, priority, task_id))
    await cur.execute("COMMIT")


"""
The delegate_task function checks if a user with the given username exists in the Users table. If not, it returns
a message indicating that the user does not exist. Otherwise, it inserts a new entry into the User_Tasks table to
delegate the task to the user. It commits the change and returns a success message.
"""


@get_pool_cur
async def delegate_task(cur: Cursor, task_id, username: str):
    await cur.execute("SELECT username FROM users WHERE username = %s", (username.lower(),))
    user = await cur.fetchone()
    if user is None:
        return {"message": "User does not exist"}
    else:
        await cur.execute(
            "INSERT INTO User_Tasks (task_id, username) VALUES (%s, %s)",
            (task_id, username.lower()))
        await cur.execute("COMMIT")
        return {"message": "Task delegated successfully"}


"""
The change_status_task function updates the status column of a task in the Tasks table with the given task ID.
It sets the status to the provided value. It commits the change to the database.
"""


@get_pool_cur
async def change_status_task(cur: Cursor, task_id, status=True):
    await cur.execute("UPDATE Tasks SET status = (%s) WHERE id = (%s)",
                      (status, task_id))
    await cur.execute("COMMIT")
