import React from 'react';
import './task.css'
import {exactTime} from "./formatTime";

const Task = (props) => {

    const postDelete = () => {
        fetch(`http://127.0.0.1:8000/tasks/Delete/?task_id=${props.task.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(props.task.id),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
    }
    const postStatus = () => {
        fetch(`http://127.0.0.1:8000/tasks/Status/?task_id=${props.task.id}&status=${props.task.status}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(props.task.id, props.task.status),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
    }


    const A = (
        <div className="task-buttons">
            <button onClick={() => {
                props.toggleEdit()
            }}>Edit
            </button>
            <button onClick={() => props.toggleDelegate()}>Delegate</button>
            <button onClick={() => {
                postDelete();
                props.getCreatedTasks()
            }}>Delete
            </button>
        </div>)

    return (
        <div className="task">
            <div className="task-inner">
                {props.whatTabSelected !== 1 ?
                    <img src={
                        props.whatTabSelected === 1 ? null :
                            props.whatTabSelected === 2
                                ? `https://t.me/i/userpic/320/${props.task.delegated_to_username}.jpg`
                                : `https://t.me/i/userpic/320/${props.task.created_by_username}.jpg`

                    } alt=""/>
                    : null}
                <div style={props.task.priority===1?{background: "#79C063"}:props.task.priority===2?{background: "#D7B258"}:{background: "#E57770"}} className="task-priority"/>
                <div>
                    <div>
                        {
                            props.whatTabSelected===1?null:<p>{props.whatTabSelected === 2 ? props.task.delegated_to_username :  props.whatTabSelected === 3 ? props.task.created_by_username: null}</p>
                        }
                        <p>{
                            exactTime(props.task.deadline_date)
                        }</p>
                        <div onClick={() => {
                            postStatus();
                            props.getCreatedTasks()
                        }} style={props.task.status ? {background: "#00ff00"} : null} className="task-check-box"/>
                    </div>
                    <p onClick={() => {
                        props.chosenTasksId === props.task.task_id ? props.choseTask(null) : props.choseTask(props.task.task_id)
                    }}> {props.task.content || '404 Task content loading error'} </p>
                </div>
            </div>
            {
                (props.chosenTasksId === props.task.task_id)? A : null
            }
        </div>
    );
};

export default Task;

