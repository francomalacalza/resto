

-- Creacion de tablas
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR (15) NOT NULL,
  fullname VARCHAR(80) NOT NULL,
  password VARCHAR (15) NOT NULL,
  email VARCHAR(30) NOT NULL,
  phone INT NOT NULL,
  address VARCHAR (60) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);