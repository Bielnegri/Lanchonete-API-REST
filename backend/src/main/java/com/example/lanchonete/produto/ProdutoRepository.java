package com.example.lanchonete.produto;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    @Query(value = "CALL sp_buscar_por_categoria(:categoria_in)", nativeQuery = true)
    List<Produto> findByCategoria(@Param("categoria_in") String categoria);
}
