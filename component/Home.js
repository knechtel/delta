import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const Home = ({ route }) => {
  const navigation = useNavigation();

  const CurrentScreenName = () => {};
  const [id, setId] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Função simulada de busca por ID
  const fetchUserData = async (id) => {
    try {
      // Aqui você poderia fazer uma requisição a uma API usando fetch ou axios, por exemplo.
      // Por enquanto, vamos simular com um dado estático.
      const simulatedDatabase = {
        1: { name: "João", age: 25 },
        2: { name: "Maria", age: 30 },
        3: { name: "Carlos", age: 35 },
      };

      if (simulatedDatabase[id]) {
        setUserData(simulatedDatabase[id]);
        setError(null);
      } else {
        setUserData(null);
        setError("Usuário não encontrado.");
      }
    } catch (error) {
      setError("Erro ao buscar dados.");
    }
  };

  // Função de busca ao pressionar o botão
  const handleSearch = () => {
    if (id) {
      fetchUserData(id);

      CurrentScreenName();

      navigation.navigate("Settings", { paramKey: id });
      // navigation.navigate("Sobre", {
      //   screen: "FormClient1",
      //   params: { paramKey: id },
      // });
    } else {
      setError("Por favor, insira um ID.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Usuário por ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o ID do usuário"
        value={id}
        onChangeText={setId}
        keyboardType="numeric"
      />
      <Button title="Buscar" onPress={handleSearch} />
      {error && <Text style={styles.error}>{error}</Text>}
      {userData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Nome: {userData.name}</Text>
          <Text style={styles.resultText}>Idade: {userData.age}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
    marginTop: 8,
    textAlign: "center",
  },
  resultContainer: {
    marginTop: 16,
  },
  resultText: {
    fontSize: 18,
  },
});

export default Home;
