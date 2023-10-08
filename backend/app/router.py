from datetime import datetime
from typing import List
# from fastapi_cors import CORS

from fastapi import FastAPI
from resources.crud import Database
from resources.schemas import Tasks, TasksWithUsername, CreateTask, EditTask, DelegatedTasks
from fastapi.middleware.cors import CORSMiddleware

# from resources.service import process_sql_results

app = FastAPI()

db = Database()

origins = [
    "http://localhost:3000",  # React App
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=["Content-Type", "Set-Cookie", "Access-Control-Allow-Headers", "Access-Control-Allow-Origin",
                   "Authorization"]

)


@app.get("/tasks/CreatedTasks/", response_model=List[Tasks])
def get_created_tasks(username: str):
    tasks = db.get_created_tasks(username)
    if not tasks:
        return []
    return [Tasks(
        task_id=field_task[0],
        content=field_task[1],
        status=field_task[2],
        deadline_date=field_task[3],
        priority=field_task[4],
    ) for field_task in tasks]


# написать функцию получения юзернейма создателя задания

@app.get("/tasks/ReceivedTasks/", response_model=List[TasksWithUsername])
def get_received_tasks(username: str):
    tasks_with_user = db.get_received_tasks(username)
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


@app.get("/tasks/DelegatedTasks/", response_model=List[DelegatedTasks])
def get_delegated_tasks(username: str):
    tasks_with_user = db.get_delegated_tasks(username)
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


@app.post("/tasks/NewTask/")
def create_task(task: CreateTask):
    db.create_task(task.created_by_username, task.status, task.content, task.deadline_date, task.priority)
    return {"message": "Task created successfully"}


@app.post("/tasks/EditTask/")
def edit_task(task: EditTask):
    db.update_task(task.task_id, task.status, task.content, task.deadline_date, task.priority)
    return {"message": "Task edited successfully"}


#
# @app.post("/users/NewUser", response_model=Users)
# def create_user(user: Users):
#     db.create_user(user.username)
#     return {"message": "User created successfully"}


@app.post("/tasks/Delete/")
def delete_task(task_id: int):
    db.delete_task(task_id)
    return {"message": "Task deleted successfully"}


@app.post("/tasks/DelegateToUsername/")
def delegate_task(task_id: int, username: str):
    response = db.delegate_task(task_id, username)
    return response


@app.post("/tasks/Status/")
def change_status_task(task_id: int, status: bool):
    db.change_status_task(task_id, status)
    return {"message": "Task status changed successfully"}


@app.post("/users/Create/")
def initialize_user(username: str):
    db.initialize_user(username)
    return {"message": "User existing now"}
