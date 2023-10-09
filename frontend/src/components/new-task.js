import React, {useState, useEffect} from 'react';
import {formatTime} from './formatTime'


const NewTask = (props) => {

    const [newTask, setNewTask] = useState({
        "status": false,
        "content": '',
        "deadline_date": null,
        "priority": null,
        "created_by_username": props.username
    })

    const [dateInputValue, setDateInputValue] = useState('');
    const [timeInputValue, setTimeInputValue] = useState('');

    useEffect(()=>{
        setNewTask(newTask => ({...newTask, deadline_date: `${dateInputValue} ${timeInputValue}`}))
        console.log(newTask)
    },[dateInputValue,timeInputValue])

    const handleTextInputChange = (event) => {
        setNewTask({...newTask, content: event.target.value});
    };
    const handleDateInputChange = (event) => {
        setDateInputValue(event.target.value);
    }
    const handleTimeInputChange = (event) => {
        setTimeInputValue(event.target.value);
    };


    const postNewTask = async () => {
        fetch(`http://127.0.0.1:8000/tasks/NewTask/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
    }

    return (
        <div className="task-form-wrapper">
            <div onClick={() => {
                props.toggle()
            }} className="hiden-exit"/>
            <div className="task-form">
                <div className="task-form-inner">
                    <h6>Task</h6>
                    <input placeholder="enter the task" type="text" value={newTask.content}
                           onChange={handleTextInputChange} className="task-form-input"/>
                    <h6>Date</h6>
                    <input placeholder="choose a date" min={formatTime().slice(0, 10)} value={dateInputValue}
                           onChange={handleDateInputChange} type="date" className="task-form-input"/>
                    <h6>Time</h6>
                    <input placeholder="choose a date" value={timeInputValue} onChange={handleTimeInputChange}
                           type="time" className="task-form-input"/>
                    <h6>Priority</h6>
                    <div className="task-priority">
                        <button style={newTask.priority === 1 ? {background: "#2e545e"} : null} onClick={() => {
                            setNewTask({...newTask, priority: 1})
                        }}>Low
                        </button>
                        <button style={newTask.priority === 2 ? {background: "#2e545e"} : null} onClick={() => {
                            setNewTask({...newTask, priority: 2})
                        }}>Medium
                        </button>
                        <button style={newTask.priority === 3 ? {background: "#2e545e"} : null} onClick={() => {
                            setNewTask({...newTask, priority: 3})
                        }}>Hight
                        </button>
                    </div>
                </div>
                <button onClick={() => {
                    if (newTask.content!=='' && newTask.priority!==null && dateInputValue!=='' && timeInputValue!==''){
                        postNewTask()
                        props.getCreatedTasks()
                        props.toggle()
                    }else alert('Fill a form')
                }}>Send
                </button>
            </div>
        </div>
    );
};

export default NewTask;