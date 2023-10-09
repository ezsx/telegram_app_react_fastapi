import React, {useState} from 'react';

const DelegateTask = (props) => {


    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const postDelegateToUsername = () => {
        fetch(`http://127.0.0.1:8000/tasks/DelegateToUsername/?task_id=${props.Id}&username=${inputValue}`, {
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
                        // window.Telegram.WebApp.showPopup(data.message)
                    }
                console.log(data);
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
                    postDelegateToUsername()
                    props.getCreatedTasks()
                    props.getDelegatedTasks()
                    props.toggle()
                }}>Send
                </button>
            </div>
        </div>
    );
};

export default DelegateTask;