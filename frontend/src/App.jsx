import './App.css';
import './user-list.css'
import Task from './components/task'
import {useThemeParams, useWebApp} from '@vkruglikov/react-telegram-web-app';
import React, {useState, useEffect} from 'react'
import NewTask from "./components/new-task";
import EditTask from "./components/edit-task";
import DelegateTask from "./components/delegate-task";

function App() {

    const currentUserName = useWebApp().initData.username || 'user1'

    const [isFirstOpening, setIsFirstOpening] = useState(true);


    useEffect(() => {
        if (isFirstOpening) {
            fetch(`http://127.0.0.1:8000/users/Create/?username=${currentUserName}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentUserName)
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log(error))
        }
        setIsFirstOpening(false)
        console.log(getCreatedTasksFunction())
    }, [isFirstOpening, currentUserName]);




    const getCreatedTasksFunction = async () => {
        fetch(`http://127.0.0.1:8000/tasks/CreatedTasks/?username=${currentUserName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setCreatedTasks(data);
              })
            // .then(data => console.log(data))
    }
    const getDelegatedTasksFunction = async () => {
        console.log(currentUserName)
        fetch(`http://127.0.0.1:8000/tasks/DelegatedTasks/?username=${currentUserName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setDelegatedTasks(data);
            })
            // .then(data => console.log(data))

    }
    const getReceivedTasksFunction = async () => {
        fetch(`http://127.0.0.1:8000/tasks/ReceivedTasks/?username=${currentUserName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setReceivedTasks(data);
            })
            // .then(data => console.log(data))
    }



    const [themeParams] = useThemeParams();

    const [createdTasks, setCreatedTasks] = useState([])

    const [receivedTasks, setReceivedTasks] = useState([])

    const [delegatedTasks, setDelegatedTasks] = useState([])

    const [isNewTask, setNewTask] = useState(false);

    const [isEditTask, setEditTask] = useState(false);

    const [whatTabSelected, setSelectedTab] = useState(1)

    const [isDelegateTask, setDelegateTask] = useState(false)

    const [chosenTasksId, setChosenTaskId] = useState('')


    const renderTast = (element) => {
        return (<Task
            key={element.task_id}
            task={element}
            chosenTasksId={chosenTasksId}

            choseTask={setChosenTaskId}
            whatTabSelected={whatTabSelected}

            toggleEdit={() => setEditTask(!isEditTask)}
            toggleDelegate={() => setDelegateTask(!isDelegateTask)}
            getCreatedTasks={() => getCreatedTasksFunction()}


        />)
    }


    return (
        <div className="App">
            <div className="wrapper">
                <div className="task-group">
                    <div className="button-wrapper">
                        <button style={whatTabSelected === 1 ? {color: themeParams.link_color || 'red'} : null}
                                onClick={() => {
                                    setSelectedTab(1)
                                    getCreatedTasksFunction()
                                }}>Created
                        </button>
                        <div style={whatTabSelected === 1 ? {background: themeParams.link_color || 'red'} : null}
                             className="half-sausage"/>
                    </div>
                    <div className="button-wrapper">
                        <button style={whatTabSelected === 2 ? {color: themeParams.link_color || 'red'} : null}
                                onClick={() => {
                                    setSelectedTab(2)
                                    getDelegatedTasksFunction()
                                }}>Delegated
                        </button>
                        <div style={whatTabSelected === 2 ? {background: themeParams.link_color || 'red'} : null}
                             className="half-sausage"/>
                    </div>
                    <div className="button-wrapper">
                        <button style={whatTabSelected === 3 ? {color: themeParams.link_color || 'red'} : null}
                                onClick={() => {
                                    setSelectedTab(3)
                                    getReceivedTasksFunction()
                                }}>Received
                        </button>
                        <div style={whatTabSelected === 3 ? {background: themeParams.link_color || 'red'} : null}
                             className="half-sausage"/>
                    </div>
                </div>
                <div>
                    <div className="task-list">
                        {
                            createdTasks.length===0 ? null :(whatTabSelected === 1&&createdTasks.map((element) => renderTast(element,false)))
                        }
                        {
                            delegatedTasks.length===0 ?null :(whatTabSelected === 2&&delegatedTasks.map((element) => renderTast(element,true)))
                        }
                        {
                            receivedTasks.length===0 ?null :(whatTabSelected === 3&&receivedTasks.map((element) => renderTast(element,true)))
                        }
                    </div>

                    {isNewTask ? <NewTask
                        toggle={() => setNewTask(!isNewTask)}
                        getCreatedTasks={() => getCreatedTasksFunction()}
                        Id={chosenTasksId}
                        username={currentUserName}
                    /> : null}

                    {isEditTask ? <EditTask
                        toggle={() => setEditTask(!isEditTask)}
                        getCreatedTasks={() => getCreatedTasksFunction()}
                        task={createdTasks.filter((element) => {
                            return element.id === chosenTasksId
                        })}


                    /> : null}


                    {isDelegateTask ? <DelegateTask
                        Id={chosenTasksId}
                        getCreatedTasks={() => getCreatedTasksFunction()}
                        getDelegatedTasks={() => getDelegatedTasksFunction()}
                        toggle={() => setDelegateTask(!isDelegateTask)}


                    /> : null}


                    {whatTabSelected===1?
                        <button onClick={() => setNewTask(!isNewTask)} className="send-button">New task</button> : null}


                </div>
            </div>
        </div>
    );
}


export default App