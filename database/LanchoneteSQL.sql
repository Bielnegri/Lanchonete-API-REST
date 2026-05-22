CREATE DATABASE lanchonete;
USE lanchonete;

CREATE TABLE produto (
	id_produto BIGINT,
	nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

ALTER TABLE produto 
ADD CONSTRAINT PRIMARY KEY id_produto(id_produto);

ALTER TABLE produto
MODIFY COLUMN id_produto BIGINT AUTO_INCREMENT;

SELECT * FROM produto;
