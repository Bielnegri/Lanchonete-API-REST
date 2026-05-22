import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import { Produto } from '../types/produto';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get<Produto[]>('/produtos'); 
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos da lanchonete:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerCard}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.categoriaTag}>{item.categoria.toUpperCase()}</Text>
            </View>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum item no cardápio ainda.</Text>
        }
        onRefresh={carregarProdutos}
        refreshing={loading}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/form')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff', padding: 16, marginHorizontal: 16, marginTop: 12,
    borderRadius: 12, borderWidth: 1, borderColor: '#eee', elevation: 2,
  },
  headerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#222', flex: 1 },
  categoriaTag: {
    backgroundColor: '#FFE5CC', color: '#FF6600', fontSize: 11,
    fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  descricao: { fontSize: 14, color: '#666', marginTop: 6, fontStyle: 'italic' },
  preco: { fontSize: 16, fontWeight: 'bold', color: '#2b9348', marginTop: 8 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 },
  fab: {
    position: 'absolute', right: 20, bottom: 20, backgroundColor: '#FF9500',
    width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: 'bold' }
});