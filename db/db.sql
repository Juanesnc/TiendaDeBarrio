CREATE DATABASE tienda;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document VARCHAR(20) UNIQUE,
    last_name VARCHAR(30),
    name VARCHAR(30),
    roles_id UUID
);

INSERT INTO users(document, last_name, name, roles_id) VALUES
    ('10002000', 'Camacho', 'Daniela', '77e7331f-5746-47bf-b88e-420abded2b3d');

CREATE TABLE products(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    description VARCHAR(30),
    name VARCHAR(30) UNIQUE,
    price INTEGER 
);

INSERT INTO products(id, description, name, price) VALUES
    ('479fba0a-baaf-4b46-95a2-83a663817646', 'Libra' ,'Arroz', 3000),
    ('efbff7f6-6374-4c2f-9c96-3611c65068ba', 'Libra', 'Papas', 1000),
    ( 'f7c377cf-0f92-435a-b5e6-2c8cdd9d10c6', '500 ml', 'Agua sin gas', 2000),
    ( '3bed5d90-64ed-4bc1-8a3a-a378737ed542', '500 ml', 'Agua con gas', 2500),
    ('c3f25f98-c5c3-4a00-b550-f716ae36b25f', 'ministro de hacienda aprueba', 'Docena de huevos', 1800);

CREATE TABLE roles(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(30) UNIQUE
);

INSERT INTO roles(id, name) VALUES
    ('77e7331f-5746-47bf-b88e-420abded2b3d', 'admin'),
    ('99a84803-17a5-4345-9853-62c8b6d76ce0','employee');

CREATE TABLE sales(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    products_id UUID,
    qty INTEGER,
    sale_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    users_id UUID
);

