import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity} from 'react-native';
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
      Alert.alert("Erro", "Não foi possível carregar o cardápio.");
    } finally {
      setLoading(false);
    }
  };

  const lidarExcluir = (id: number, nome: string) => {
    Alert.alert(
      "Excluir Produto",
      `Tem certeza que deseja remover "${nome}" do cardápio?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/produtos/${id}`);
              
              setProdutos(produtosAtuais => produtosAtuais.filter(p => p.id !== id));
              
              Alert.alert("Sucesso", "Produto removido com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir produto:", error);
              Alert.alert("Erro", "Não foi possível excluir o produto.");
            }
          }
        }
      ]
    );
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
            <View style={styles.bodyCard}>
              <Text style={styles.descricao}>{item.descricao}</Text>
              <View style={styles.footerCard}>
                <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
                <View style={styles.containerAcoes}>
                  <TouchableOpacity
                    style={styles.botaoEditar}  
                    onPress={() => router.push({pathname: '/form', params: {id: item.id}})} 
                  >
                    <Text style={styles.editarText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.botaoExcluir}  
                    onPress={() => lidarExcluir(item.id, item.nome)} 
                  >
                    <Text style={styles.excluirText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum item no cardápio ainda.</Text>
        }
        onRefresh={carregarProdutos}
        refreshing={loading}
      />
      
      <TouchableOpacity 
        style={styles.botaoForm} 
        onPress={() => router.push('/form')}
      >
        <Text style={styles.formText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    backgroundColor: '#494949', padding: 16, marginHorizontal: 16, marginTop: 12,
    borderRadius: 12, borderWidth: 1, borderColor: '#616161', elevation: 2,
  },

  headerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  nome: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', flex: 1 },

  categoriaTag: {
    backgroundColor: '#8AA7FF', color: '#1F57FF', fontSize: 11,
    fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },

  bodyCard: { marginTop: 4 },

  descricao: { fontSize: 14, color: '#DADADA', marginTop: 6, fontStyle: 'italic' },

  preco: { fontSize: 16, fontWeight: 'bold', color: '#2b9348' },
  
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  containerAcoes: {
    flexDirection: 'row',
    gap: 8, 
  },

  botaoEditar: {
    backgroundColor: '#4CAF50', paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 6, fontSize: 14, fontWeight: 'bold'
  },

  botaoExcluir: {
    backgroundColor: '#F44336', paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 6, fontSize: 14, fontWeight: 'bold'
  },

  editarText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  excluirText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 },

  botaoForm: {
    position: 'absolute', right: 20, bottom: 20, backgroundColor: '#1F57FF',
    width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4,
  },

  formText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', lineHeight: 34 }
});