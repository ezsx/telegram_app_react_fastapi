//Import all dependency
import './App.scss';
import Task from './components/task'
import {useThemeParams, useInitData} from '@vkruglikov/react-telegram-web-app';
import React, {useEffect, useState} from 'react'
import NewTask from "./components/new-task";
import EditTask from "./components/edit-task";
import DelegateTask from "./components/delegate-task";

function App() {

    const [initDataUnsafe] = useInitData();

    const server_ip = "https://adooba.ru:8000/";//url address of database
    //const test_username = "user1";//username using in tests

    const currentUserName = initDataUnsafe.user.username.toLowerCase()//name of our app user

    //we request from the database the data necessary to start the application
    useEffect(() => {
        fetch(`${server_ip}users/Create/?username=${currentUserName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentUserName)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                getCreatedTasksFunction()
            })
            .catch(error => console.log(error))
    }, []);

    //function then request array of our task
    const getCreatedTasksFunction = () => {
        fetch(`${server_ip}tasks/CreatedTasks/?username=${currentUserName}`)
            .then(response => response.json())
            .then(data => {
                setCreatedTasks(data);
            })
    }
    //function then request array of tasks then we delegated
    const getDelegatedTasksFunction = () => {
        fetch(`${server_ip}tasks/DelegatedTasks/?username=${currentUserName}`)
            .then(response => response.json())
            .then(data => {
                setDelegatedTasks(data);
            })
    }
    //function then request array of tasks that were delegated to us
    const getReceivedTasksFunction = () => {
        fetch(`${server_ip}tasks/ReceivedTasks/?username=${currentUserName}`)
            .then(response => response.json())
            .then(data => {
                setReceivedTasks(data);
            })
    }

    //announce all states
    //useState is a React Hook that lets you add a state variable to your component.
    //view https://react.dev/learn/state-a-components-memory to learn more about react useState()
    const [colorScheme, themeParams] = useThemeParams();

    const [createdTasks, setCreatedTasks] = useState([])//state of our tasks

    const [receivedTasks, setReceivedTasks] = useState([])//state of tasks that were delegated to us

    const [delegatedTasks, setDelegatedTasks] = useState([])//state of tasks that we delegated

    const [isNewTask, setNewTask] = useState(false);//state which determines whether the newTask component is shown

    const [isEditTask, setEditTask] = useState(false);//state which determines whether the editTask component is shown

    const [isDelegateTask, setDelegateTask] = useState(false)//state which determines whether the delegateTask component is shown

    const [whatTabSelected, setSelectedTab] = useState(1)//state which records which tab is selected

    const [chosenTasksId, setChosenTaskId] = useState('')//state in which the id of the selected task is written

    //create a model that will be used for rendering Task element
    const renderTast = (element) => {
        return (<Task
            //passing values ​​to the element

            /*Keys tell React which array item each component corresponds to, so that it can match them up later.
             This becomes important if your array items can move (e.g. due to sorting), get inserted, or get deleted.
             A well-chosen key helps React infer what exactly has happened, and make the correct updates to the DOM tree*/
            key={element.task_id}//key of Task element

            task={element}
            chosenTasksId={chosenTasksId}
            server_ip={server_ip}

            choseTask={setChosenTaskId}
            whatTabSelected={whatTabSelected}

            toggleEdit={() => setEditTask(!isEditTask)}
            toggleDelegate={() => setDelegateTask(!isDelegateTask)}
            getCreatedTasks={() => getCreatedTasksFunction()}
            getAllTasks={() => {
                getCreatedTasksFunction();
                getReceivedTasksFunction();
                getDelegatedTasksFunction();
            }}


        />)
    }

    //return html DOM tree
    return (
        <div className="App">
            <div className="wrapper">
                <div className="task-group">
                    <div className="button-wrapper">
                        <button style={whatTabSelected === 1 ? {color: themeParams.link_color || 'red'} : null}
                                onClick={() => {
                                    console.log(currentUserName)
                                    console.log(initDataUnsafe)
                                    setSelectedTab(1)//pass the value 1 to whatTabSelected state
                                    getCreatedTasksFunction()//call the function getCreatedTasksFunction
                                }}>Created
                        </button>
                        <div style={whatTabSelected === 1 ? {background: themeParams.link_color || 'red'} : null}
                             className="half-sausage"/>
                    </div>
                    <div className="button-wrapper">
                        <button style={whatTabSelected === 2 ? {color: themeParams.link_color || 'red'} : null}
                                onClick={() => {
                                    setSelectedTab(2)//pass the value 2 to whatTabSelected state
                                    getDelegatedTasksFunction()//call the function getDelegatedTasksFunction
                                }}>Delegated
                        </button>
                        <div style={whatTabSelected === 2 ? {background: themeParams.link_color || 'red'} : null}
                             className="half-sausage"/>
                    </div>
                    <div className="button-wrapper">
                        <button style={whatTabSelected === 3 ? {color: themeParams.link_color || 'red'} : null}
                                onClick={() => {
                                    setSelectedTab(3)//pass the value 3 to whatTabSelected state
                                    getReceivedTasksFunction()//call the function getReceivedTasksFunction
                                }}>Received
                        </button>
                        <div style={whatTabSelected === 3 ? {background: themeParams.link_color || 'red'} : null}
                             className="half-sausage"/>
                    </div>
                </div>
                <div>
                    <div className="task-list">
                        {
                            createdTasks.length === 0 //check if the length of the array is 0
                                ? null//then return null
                                : (whatTabSelected === 1 && createdTasks.map((element) => renderTast(element, false)))//else return our Task element
                        }
                        {
                            delegatedTasks.length === 0
                                ? null
                                : (whatTabSelected === 2 && delegatedTasks.map((element) => renderTast(element, true)))
                        }
                        {
                            receivedTasks.length === 0
                                ? null
                                : (whatTabSelected === 3 && receivedTasks.map((element) => renderTast(element, true)))
                        }
                    </div>

                    {isNewTask //check if the state isNewTask is true
                        ? <NewTask//then return NewTask element
                            //passing values ​​to the element
                            toggle={() => setNewTask(!isNewTask)}
                            getCreatedTasks={() => getCreatedTasksFunction()}
                            Id={chosenTasksId}
                            username={currentUserName}
                            server_ip={server_ip}
                        /> : null}

                    {isEditTask
                        ? <EditTask
                            toggle={() => setEditTask(!isEditTask)}
                            getCreatedTasks={() => getCreatedTasksFunction()}
                            task={createdTasks.filter((element) => {
                                return element.task_id === chosenTasksId
                            })[0]}
                            server_ip={server_ip}
                        /> : null}


                    {isDelegateTask
                        ? <DelegateTask
                            Id={chosenTasksId}
                            getCreatedTasks={() => getCreatedTasksFunction()}
                            getDelegatedTasks={() => getDelegatedTasksFunction()}
                            toggle={() => setDelegateTask(!isDelegateTask)}

                            server_ip={server_ip}
                        /> : null}


                    {whatTabSelected === 1
                        ?
                        <button onClick={() => setNewTask(!isNewTask)} className="send-button">New task</button>
                        : null}

                </div>
            </div>
        </div>
    );
}


export default App