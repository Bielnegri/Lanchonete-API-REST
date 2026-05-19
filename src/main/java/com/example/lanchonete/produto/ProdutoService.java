package com.example.lanchonete.produto;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ProdutoMapper produtoMapper;

    public Produto salvarOuAtualizar(ProdutoDTO dto){
        if(dto.id() != null){
            Produto existente = produtoRepository.findById(dto.id())
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com id: " + dto.id()));
            produtoMapper.updateEntityFromDto(dto, existente);
            return produtoRepository.save(existente);
        } else {
            Produto novo =  produtoMapper.toEntityFromAtualizacao(dto);
            return produtoRepository.save(novo);
        }
    }

    public List<Produto> procurarTodos(){
        return produtoRepository.findAll();
    }

    public void apagarPorId(Long id){
        produtoRepository.deleteById(id);
    }

    public Produto procurarPorId(Long id) throws EntityNotFoundException{
        return produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com id: " + id));
    }

    public List<Produto> procurarPorCategoria(String categoria){
        return produtoRepository.findByCategoria(categoria);
    }
}
