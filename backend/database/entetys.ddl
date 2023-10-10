drop table User_Tasks;
drop table Tasks;
drop table users;


CREATE TABLE IF NOT EXISTS Users(
    username VARCHAR(255) PRIMARY KEY not null
);
CREATE TABLE IF NOT EXISTS Tasks (
    id SERIAL PRIMARY KEY,
    created_by VARCHAR(255) REFERENCES Users(username),
    status bool,
    content TEXT,
    deadline VARCHAR(255),
    priority INT
);
CREATE TABLE IF NOT EXISTS User_Tasks (
    username  VARCHAR(255) REFERENCES Users(username),
    task_id INT REFERENCES Tasks(id)
);


INSERT INTO Users (username) VALUES ('user1'), ('user2'), ('user3'), ('user4');

INSERT INTO Tasks (id, created_by, status, content, deadline, priority)
VALUES
(1, 'user1', FALSE, 'Task 1 content', '2023-10-10 10:00:00', 1),
(2, 'user2', True, 'Task 2 content', '2023-10-10 11:00:00', 2),
(3, 'user3', FALSE, 'Task 3 content', '2023-10-10 12:00:00', 3),
(4, 'user4', True, 'Task 4 content', '2023-10-10 13:00:00', 4);

INSERT INTO User_Tasks (username, task_id)
VALUES
('user1', 2),
('user2', 3),
('user3', 1),
('user4', 4);


-- Inserting more users
INSERT INTO Users (username) VALUES
('user5'),
('user6'),
('user7'),
('user8'),
('user9'),
('user10');

-- Inserting more tasks
INSERT INTO Tasks (id, created_by, status, content, deadline, priority)
VALUES
(5, 'user1', True, 'Task 5 content', '2023-10-10 14:00:00', 1),
(6, 'user2', True, 'Task 6 content', '2023-10-10 15:00:00', 2),
(7, 'user3', True, 'Task 7 content', '2023-10-10 16:00:00', 3),
(8, 'user4', FALSE, 'Task 8 content', '2023-10-10 17:00:00', 4),
(9, 'user5', FALSE, 'Task 9 content', '2023-10-10 18:00:00', 1),
(10, 'user6', FALSE, 'Task 10 content', '2023-10-10 19:00:00', 2);

-- Inserting more user-task relationships
INSERT INTO User_Tasks (username, task_id)
VALUES
('user1', 6),
('user2', 7),
('user3', 8),
('user4', 9),
('user5', 10),
('user6', 5);

-- duplicated relations
INSERT INTO User_Tasks (username, task_id)
VALUES
('user6', 10),
('user6', 8);

insert INTO Users (username)
VALUES
('exonys');




