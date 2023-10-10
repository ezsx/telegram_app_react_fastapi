import logging
from typing import List
from resources.crud import *
from fastapi import FastAPI
from resources.schemas import Tasks, TasksWithUsername, CreateTask, EditTask, DelegatedTasks
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

"""
Add CORS middleware support
The middleware responds to certain types of HTTP requests. It adds appropriate CORS headers to the response
CORS or "Cross-Origin Resource Sharing" refers to situations when a frontend running in a browser has JavaScript code
that communicates with a backend, and the backend is in a different "origin" than the frontend.
"""

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=["Content-Type", "Set-Cookie", "Access-Control-Allow-Headers", "Access-Control-Allow-Origin",
                   "Authorization"]

)


# Function to be called when the server starts
@app.on_event("startup")
async def open_pool():
    await pool.open()
    await init_db()
    logging.debug(f'=> pool open: ')


# Function to be called when the server shuts down
@app.on_event("shutdown")
async def close_pool():
    await pool.close()
    logging.debug('=> pool close /)')


# API endpoint to get created tasks
@app.get("/tasks/CreatedTasks/", response_model=List[Tasks])
async def api_get_created_tasks(username: str):
    tasks = await get_created_tasks(username)
    if not tasks:
        return []
    return [Tasks(
        task_id=field_task[0],
        content=field_task[1],
        status=field_task[2],
        deadline_date=field_task[3],
        priority=field_task[4],
    ) for field_task in tasks]


# API endpoint to get received tasks
@app.get("/tasks/ReceivedTasks/", response_model=List[TasksWithUsername])
async def api_get_received_tasks(username: str):
    tasks_with_user = await get_received_tasks(username)
    if not tasks_with_user:
        return []
    return [TasksWithUsername(
        task_id=field_task[0],
        content=field_task[1],
        status=field_task[2],
        deadline_date=field_task[3],
        priority=field_task[4],
        created_by_username=field_task[5]
    ) for field_task in tasks_with_user]


# API endpoint to get delegated tasks
@app.get("/tasks/DelegatedTasks/", response_model=List[DelegatedTasks])
async def api_get_delegated_tasks(username: str):
    tasks_with_user = await get_delegated_tasks(username)
    print(tasks_with_user)
    if not tasks_with_user:
        return []
    return [DelegatedTasks(
        task_id=field_task[0],
        content=field_task[1],
        status=field_task[2],
        deadline_date=field_task[3],
        priority=field_task[4],
        delegated_to_username=field_task[5]
    ) for field_task in tasks_with_user]


# API endpoint to create a new task
@app.post("/tasks/NewTask/")
async def api_create_task(task: CreateTask):
    await create_task(task.created_by_username, task.status, task.content, task.deadline_date, task.priority)
    return {"message": "Task created successfully"}


# API endpoint to edit a task
@app.post("/tasks/EditTask/")
async def api_edit_task(task: EditTask):
    await update_task(task.task_id, task.status, task.content, task.deadline_date, task.priority)
    return {"message": "Task edited successfully"}


# API endpoint to delete a task
@app.post("/tasks/Delete/")
async def api_delete_task(task_id: int):
    await delete_task(task_id)
    return {"message": "Task deleted successfully"}


# API endpoint to delegate a task to a username
@app.post("/tasks/DelegateToUsername/")
async def api_delegate_task(task_id: int, username: str):
    response = await delegate_task(task_id, username)
    return response


# API endpoint to change the status of a task
@app.post("/tasks/Status/")
async def api_change_status_task(task_id: int, status: bool):
    await change_status_task(task_id, status)
    return {"message": "Task status changed successfully"}


# API endpoint to initialize a user
@app.post("/users/Create/")
async def api_initialize_user(username: str):
    await initialize_user(username)
    return {"message": "User existing now"}
