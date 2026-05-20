package com.example.lanchonete.produto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProdutoDTO (
    Long id,

    @NotBlank(message = "Nome é obrigatório!")
    String nome,

    @NotBlank(message = "Descrição é obrigatório!")
    String descricao,

    @NotNull(message = "Preço é obrigatório!")
    float preco,

    @NotBlank(message = "Categoria é obrigatório!")
    String categoria

) {}
