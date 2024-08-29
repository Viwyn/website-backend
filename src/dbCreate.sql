CREATE DATABASE IF NOT EXISTS website;
USE website;

DROP TABLE IF EXISTS experience;
DROP TABLE IF EXISTS api_key;
DROP TABLE IF EXISTS user;

CREATE TABLE experience( 
    id int AUTO_INCREMENT, 
    name varchar(100) NOT NULL, 
    startDate date NOT NULL, 
    endDate date, 
    description varchar(500), 
    img varchar(512), 
    
    PRIMARY KEY (id));

CREATE TABLE user (
    id INT AUTO_INCREMENT,
    username VARCHAR(32) NOT NULL,
    password BINARY(60) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE api_key (
    id INT AUTO_INCREMENT,
    apikey VARCHAR(32) NOT NULL,
    user INT,

    PRIMARY KEY (id),
    FOREIGN KEY (user) REFERENCES user(id)
);