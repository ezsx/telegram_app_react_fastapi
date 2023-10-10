import React from 'react';
import './task.scss'
import {exactTime} from "./formatTime";



const Task = (props) => {

    //create a function that will tell the backend to delete a task with id = props.task.task_id
    const postDelete = () => {
        fetch(`${props.server_ip}tasks/Delete/?task_id=${props.task.task_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                props.getCreatedTasks();
            })
            .catch(error => console.log(error))
    }
    //create a function that will tell the backend to switch the task status
    const postStatus = () => {
        fetch(`${props.server_ip}tasks/Status/?task_id=${props.task.task_id}&status=${!props.task.status}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(props.task.id, props.task.status),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                props.getAllTasks();
            })
            .catch(error => console.log(error))
    }

    //create a model that will be used for rendering Buttons element
    const Buttons = (
        <div className="task-buttons">
            <button onClick={() => {
                props.toggleEdit()
            }}>Edit
            </button>
            <button onClick={() => props.toggleDelegate()}>Delegate</button>
            <button onClick={() => {
                postDelete();
            }}>Delete
            </button>
        </div>)

    return (
        <div className="task">
            <div className="task-inner">
                {props.whatTabSelected !== 1 ?//if props.whatTabSelected !==1 then render img
                    <img src={
                        props.whatTabSelected === 1 ? null ://select the address for the image based on the value props.whatTabSelected
                            props.whatTabSelected === 2
                                ? `https://t.me/i/userpic/320/${props.task.delegated_to_username}.jpg`
                                : `https://t.me/i/userpic/320/${props.task.created_by_username}.jpg`

                    } alt=""/>
                    : null}

                {/*  change the background based on the value props.task.priority*/}
                <div style={props.task.priority===1?{background: "#79C063"}:props.task.priority===2?{background: "#D7B258"}:{background: "#E57770"}} className="task-priority"/>
                <div>
                    <div>
                        {
                            props.whatTabSelected===1?null:<p>{props.whatTabSelected === 2 ? props.task.delegated_to_username :  props.whatTabSelected === 3 ? props.task.created_by_username: null}</p>
                        }
                        <p style={(new Date().getTime() > new Date(props.task.deadline_date).getTime())//change the color of the test if the deadline is overdue
                                ? {color: 'red'}
                                : null}>
                            {(new Date().getTime() < new Date(props.task.deadline_date).getTime())//if deadline is not overdue
                                ? exactTime(props.task.deadline_date)//then render number of days until deadline
                                : 'Expired'//else render message "Expired"
                            }
                        </p>
                        {/*call a function that changes the task status in the database*/}
                        <div onClick={() => props.whatTabSelected!==2?postStatus():null} style={props.task.status ? {background: "#00ff00"} : null} className="task-check-box"/>
                    </div>
                    <p onClick={() => {
                        props.chosenTasksId === props.task.task_id ? props.choseTask(null) : props.choseTask(props.task.task_id)//change the currentTaskId value by clicking on the text
                    }}> {props.task.content || '404 Task content loading error'} </p>
                </div>
            </div>
            {
                (props.chosenTasksId === props.task.task_id && props.whatTabSelected === 1)? Buttons : null//if props.chosenTasksId === props.task.task_id && props.whatTabSelected === 1 then render Buttons element
            }
        </div>
    );
};

export default Task;

