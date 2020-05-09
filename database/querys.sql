
CREATE DATABASE resto;
USE resto;

DROP TABLE users;
DROP TABLE products;
DROP TABLE orders;
DROP TABLE order_products;

CREATE TABLE users (
  userId INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR (15) NOT NULL,
  fullname VARCHAR(80) NOT NULL,
  password VARCHAR (15) NOT NULL,
  email VARCHAR(30) NOT NULL,
  phone INT NOT NULL,
  address VARCHAR (60) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE orders (
  orderId int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  date datetime NOT NULL,
  paymentMethod varchar(60) NOT NULL,
  total float NOT NULL,
  status varchar(20) NOT NULL,
  userId int NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (userId)
);

CREATE TABLE products (
  productId int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name varchar(60) NOT NULL,
  price float NOT NULL,
  description varchar(150) NOT NULL,
  imgUrl varchar(255) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE order_products (
  orderId int NOT NULL,
  productId int NOT NULL,
  amount int NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders (orderId),
  FOREIGN KEY (productId) REFERENCES products (productId)
);

INSERT INTO users VALUES (1,'admin','admin','admin','franco@gmail.com',1234567,'Calle Falsa 123',1)
,(3,'user2','user2','5678','user2@gmail.com',1234567,'Calle Falsa 123',0)
,(4,'user3','user3','5678','user3@gmail.com',1234567,'Calle Falsa 123',0)
,(5,'user4','user3','5678','user4@gmail.com',1234567,'Calle Falsa 123',0);

INSERT INTO orders VALUES (1,'2005-07-02 00:00:00','cash',0,'Confirmado',4);

INSERT INTO products VALUES (1,'Hamburguesa con papas',250,'Medallon de carne de 150g, jamon, queso, tomate y lechuga, con una porcion de papas fritas.','https://via.placeholder.com/444',1)
,(2,'Pizza especial',350,'Jamon, morron y aceituna.','https://via.placeholder.com/732',0)
,(3,'Agua tonica',100,'Agua con gas.','https://via.placeholder.com/732',1);

INSERT INTO order_products VALUES (1, 1, 2)
,(1, 3, 1)