package com.example.lanchonete.produto;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {
    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos(){
        List<Produto> produtos = produtoService.procurarTodos();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Produto produto = produtoService.procurarPorId(id);
        return ResponseEntity.ok(produto);
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Produto>> buscarPorCategoria(@PathVariable String categoria){
        List<Produto> produtos = produtoService.procurarPorCategoria(categoria);
        return ResponseEntity.ok(produtos);
    }

    @PostMapping("/form")
    public ResponseEntity<Produto> salvar(@RequestBody @Valid ProdutoDTO dto) {
        Produto novo = produtoService.salvarOuAtualizar(dto);
        return ResponseEntity.ok(novo);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoService.apagarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
