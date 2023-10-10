## Telegram distribute tasks web application

This application is designed so that telegram users can easily exchange tasks between each other.

## Project Description

In this application, telegram users can keep their to-do list, and delegate their tasks to other people. The operations 
of: creating, editing, delegating and updating the status of tasks
are available to us. The key feature is that each task created by us can be delegated to another telegram user
who uses our application. Similarly, other telegram users can create and delegate tasks to us. When creating a task, 
we select its deadline time and its priority. 
In the application, we can switch between three task lists. The first list is a list of tasks created by us,
these tasks are visible only to us, we can delete and edit them, mark them as completed, as well as delegate
them to another user. The second list represents tasks that we delegate to other users. The third list displays
the tasks that are delegated to us. When we delegate a task, we need to specify the username to whom the task
will be sent.

## Technologies Used

To write this project uses `React and FastAPi`
The `Postgresql` database is used on the server side of the application. So that the server can be easily deployed on 
any remote machine, we use `dockerfile` and `docker-compose`. They allow you to build a `FastApi` and `Postgresql` 
project for further work with it.  `React` is configured to run the project on `github-pages`, we give the
telegram @Botfather link to the page with the assembled `React` project, then when accessing the bot, this link opens and
the user is already working with our application, which in turn accesses the backend endpoints.
[here I tried to illustrate how it all works:](images/tchnologies.jpg)


## Installation

#### launch local:
To install this project, locally, you will need to follow a few steps:
1) Run [docker-compose_local.yml](backend/docker-compose_local.yml) with the `docker-compose -f docker-compose_local.yml --env-file .env up -d` command
(to turn it off, use `docker-compose -f docker-compose_local.yml --env-file .env down`)
####
2) Run the React project from the [frontend folder](frontend), in this folder in the [package.json](frontend/package.json) you must select a script to
run, "start": "react-scripts start", an interpreter must be installed in your environment to run node.js .

After these steps, the React application will be launched on the localhost:3000 server, since it is running locally, the colors for the entire application will be taken by default, the ones I specified. In turn, the documentation of the fastapi endpoints of the project will be launched on localhost:8000/docs.
#### launch on server:
if you want to launch this project so that it starts working for all telegram users, then you will need to be prepared for several things beforehand:

1) We can only register web applications running over https protocol. Therefore, I suggest using github pages to launch 
React. To do this, you need to run your project on githubpages and in package.json specify your git repository accordingly.

2) For the backend, we need a virtual machine that is located on the https domain. There are a lot of cloud services on
the Internet, I chose yandex cloud for myself. If you choose it too, then there is another docker in the project-compose
file, it will make it easier for you to run a virus machine on yandex cloud.

> NOTE
> 
> To run frontend on https, I use github pages. However, this is only half of the problem. Since our frontend works over https, the backend should also work over https, which means that we need to get a certified tsl (ssl) certificate to ensure a secure connection. To do this, you need a domain name for your public ip address where you run a virtual machine with docker, which I think is difficult to do today, so before you start developing, keep in mind that together with the virtual machine you need a domain name with a signed certificate

# Comments on this project

Cons and remarks:
1) At the moment, not all themes are supported in this application, for example, the light theme on the windows client looks terrible at the moment
2) There is no logic to remove tasks from other users, and those that we delegated
3) the design of the status display also looks bad now
4) there is no filtering by tasks, this scenario is not thought out.
4) In general, it was not possible to spend the proper amount of time on the debag of the application, the main problem that was solved was the problem with https, I described it above.
5) Instead of native pop-ups from telegrams, regular alerts are now used.
6) The delegation window is also not done in the best way. I wanted to use the native contact selection window, as in @wallet.
7) an already completed task can be sent to someone

What is done: 

In general, the main idea of the application has been implemented, bugs are possible, but they are not critical and should not affect the basic ideology of the application.