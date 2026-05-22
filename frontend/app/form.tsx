import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function FormProduto() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const salvarProduto = async () => {
    if (!nome || !descricao || !preco || !categoria) {
      Alert.alert('Campos Obrigatórios', 'Preencha todas as informações do produto.');
      return;
    }

    try {
      setSubmitting(true);

      const produtoDTO = {
        nome: nome,
        descricao: descricao,
        preco: parseFloat(preco.replace(',', '.')),
        categoria: categoria
      };

      await api.post('/produtos/form', produtoDTO);

      Alert.alert('Sucesso 🎉', 'Produto adicionado ao cardápio!', [
        { text: 'Legal', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.label}>Nome do Item</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: X-Burguer Artesanal"
      />

      <Text style={styles.label}>Descrição / Ingredientes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Pão de brioche, blend 150g, queijo prato..."
        multiline={true}
        numberOfLines={3}
      />

      <Text style={styles.label}>Preço (R$)</Text>
      <TextInput
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        placeholder="Ex: 28.50"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Categoria</Text>
      <TextInput
        style={styles.input}
        value={categoria}
        onChangeText={setCategoria}
        placeholder="Ex: Lanches, Bebidas, Sobremesas"
      />

      <TouchableOpacity 
        style={[styles.button, submitting && styles.buttonDisabled]} 
        onPress={salvarProduto}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? 'Adicionando...' : 'Adicionar ao Cardápio'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 15, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    color: '#333'
  },
  textArea: { textAlignVertical: 'top', minHeight: 80 },
  button: {
    backgroundColor: '#FF9500',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: { backgroundColor: '#ffcc80' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});