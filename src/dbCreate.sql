CREATE DATABASE IF NOT EXISTS website;
USE website;

CREATE TABLE IF NOT EXISTS experience( 
    id int AUTO_INCREMENT, 
    name varchar(100) NOT NULL, 
    startDate date NOT NULL, 
    endDate date, 
    description varchar(500), 
    img varchar(512), 
    
    PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS user (
    username VARCHAR(32) NOT NULL,
    password VARCHAR(60) NOT NULL,

    PRIMARY KEY (username)
);