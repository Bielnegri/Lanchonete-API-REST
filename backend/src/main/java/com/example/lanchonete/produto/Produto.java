package com.example.lanchonete.produto;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "produto")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private Long id;
    private String nome;
    private String descricao;
    private float preco;
    private String categoria;

    public Produto(ProdutoDTO dto){
        this.nome = dto.nome();
        this.descricao = dto.descricao();
        this.preco = dto.preco();
        this.categoria = dto.categoria();
    }

    public void atualizarProduto(ProdutoDTO dto){
        if(dto.nome() != null){
            this.nome = dto.nome();
        }
        if(dto.descricao() != null){
            this.descricao = dto.descricao();
        }
        if(dto.preco() != 0){
            this.preco = dto.preco();
        }
        if(dto.categoria() != null){
            this.categoria = dto.categoria();
        }
    }

}
