from pydantic import BaseModel, Field


class CreateTask(BaseModel):
    status: bool = Field(description='Status of task (in progress, complete, etc)')
    content: str = Field(description='The text of this task')
    deadline_date: str = Field(description='Date of end task')
    priority: int = Field(description='How much priority is this task')
    created_by_username: str = Field(description='username of the task creator')


class EditTask(BaseModel):
    task_id: int = Field(description='Task id in database')
    status: bool = Field(description='Status of task (in progress, complete, etc)')
    content: str = Field(description='The text of this task')
    deadline_date: str = Field(description='Date of end task')
    priority: int = Field(description='How much priority is this task')


class DelegatedTasks(BaseModel):
    task_id: int = Field(description='Task id in database')
    content: str = Field(description='The text of this task')
    status: bool = Field(description='Status of task (in progress, complete, etc)')
    deadline_date: str = Field(description='Date of end task')
    priority: int = Field(description='How much priority is this task')
    delegated_to_username: str = Field(description='username of the task creator')


class Tasks(BaseModel):
    task_id: int = Field(description='Task id in database')
    status: bool = Field(description='Status of task (in progress, complete, etc)')
    content: str = Field(description='The text of this task')
    deadline_date: str = Field(description='Date of end task')
    priority: int = Field(description='How much priority is this task')


class TasksWithUsername(Tasks):
    created_by_username: str = Field(description='username of the task creator')

