import { useLocalSearchParams, useRouter } from "expo-router"; // Importado useLocalSearchParams
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";
import { Produto } from "../types/produto";

export default function FormProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const carregarProdutoParaEdicao = async () => {
        try {
          setLoading(true);
          const response = await api.get<Produto>(`/produtos/${id}`);
          const produto = response.data;

          setNome(produto.nome);
          setDescricao(produto.descricao);
          setPreco(produto.preco.toString());
          setCategoria(produto.categoria);
        } catch (error) {
          console.error("Erro ao buscar dados do produto para edição:", error);
          Alert.alert(
            "Erro",
            "Não foi possível carregar os dados deste produto.",
          );
          router.back();
        } finally {
          setLoading(false);
        }
      };

      carregarProdutoParaEdicao();
    }
  }, [id]);

  const guardarProduto = async () => {
    if (!nome || !descricao || !preco || !categoria) {
      Alert.alert(
        "Campos Obrigatórios",
        "Preencha todas as informações do produto.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const produtoDTO = {
        id: isEditing ? parseInt(id) : null,
        nome: nome,
        descricao: descricao,
        preco: parseFloat(preco.replace(",", ".")),
        categoria: categoria,
      };

      if (isEditing) {
        await api.put("/produtos/form", produtoDTO);

        Alert.alert("Sucesso!!", "Produto atualizado no cardápio!", [
          { text: "Ok", onPress: () => router.replace("/") },
        ]);
      } else {
        await api.post("/produtos/form", produtoDTO);

        Alert.alert("Sucesso!!", "Produto adicionado ao cardápio!", [
          { text: "Ok", onPress: () => router.replace("/") },
        ]);
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      Alert.alert(
        "Erro",
        `Não foi possível ${isEditing ? "alterar" : "cadastrar"} o produto.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF9500" />
        <Text style={{ marginTop: 10, color: "#FFFFFF" }}>
          Buscando informações do item...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.botaoVoltar}
      >
        <Text style={styles.voltarText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.tituloTela}>
        {isEditing ? "Editar Item" : "Novo Item"}
      </Text>

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
        style={[styles.botaoSalvar, submitting && styles.salvarDisabled]}
        onPress={guardarProduto}
        disabled={submitting}
      >
        <Text style={styles.salvarText}>
          {submitting
            ? isEditing
              ? "Salvando..."
              : "Adicionando..."
            : isEditing
              ? "Salvar Alterações"
              : "Adicionar ao Cardápio"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#181818", padding: 20 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181818",
  },

  tituloTela: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DADADA",
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    backgroundColor: "#303030",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#494949",
    color: "#FFFFFF",
  },

  textArea: { textAlignVertical: "top", minHeight: 80 },

  botaoSalvar: {
    backgroundColor: "#1F57FF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },

  salvarDisabled: { backgroundColor: "#5C85FF" },

  salvarText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },

  botaoVoltar: { marginBottom: 20 },

  voltarText: { color: "#1F57FF", fontSize: 18, fontWeight: "bold" },
});
