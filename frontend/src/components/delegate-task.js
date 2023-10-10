import React, {useState} from 'react';


const DelegateTask = (props) => {

    //create a state that will store the username values ​​from the input
    const [inputValue, setInputValue] = useState('');

    //create a function that will send the username from the input to the state
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    //create a function that will send the username and task id to the database
    const postDelegateToUsername = () => {
        fetch(`${props.server_ip}tasks/DelegateToUsername/?task_id=${props.Id}&username=${inputValue}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                // Process the data here
                    if (data.message==="User does not exist"){
                        alert("This user is not yet in our application")
                    }
                    props.getCreatedTasks();
                })
            .catch(error => console.log(error))
    }



    return (
        <div className="task-form-wrapper">
            <div onClick={() => {
                props.toggle()
            }} className="hiden-exit"/>
            <div className="task-form">
                <div className="task-form-inner">
                    <div className="user">
                        <img src={`https://t.me/i/userpic/320/${inputValue}.jpg` || '../images/noUserLogo.png'} alt="IMG"/>
                        <input value={inputValue} onChange={handleInputChange} placeholder="username" type="text"/>
                    </div>
                </div>
                <button onClick={() => {
                    //call a function that will send the username and task id to the database
                    postDelegateToUsername()
                    props.toggle()
                }}>Send
                </button>
            </div>
        </div>
    );
};

export default DelegateTask;