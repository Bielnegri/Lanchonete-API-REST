package com.example.lanchonete.produto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProdutoMapper {
    ProdutoDTO toAtualizacaoDto(Produto Produto);

    @Mapping(target = "id", ignore = true)
    Produto toEntityFromAtualizacao(ProdutoDTO dto);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(ProdutoDTO dto, @MappingTarget Produto produto);
}
