import { useEffect } from "react";
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Linking } from "react-native";
import { CREATE_CLIENT, FIND_BY_ID_CLIENT, UPDATE_CLIENT } from "../util/urls";
import { useNavigation } from "@react-navigation/native";
const Settings = ({ route }) => {
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [id, setId] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [novo, setNovo] = useState(false);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  async function downloadAndSharePDF() {
    try {
      const pdfUrl =
        "http://ec2-52-67-56-229.sa-east-1.compute.amazonaws.com:8080/download?id=" +
        id;
      const nome = id + "arquivo.pdf";
      const fileUri = `${FileSystem.documentDirectory}` + nome;

      // Baixa o PDF para o diretório de documentos do aplicativo
      const download = await FileSystem.downloadAsync(pdfUrl, fileUri);
      await sleep(500);
      if (download.status === 200) {
        console.log("PDF baixado e salvo em:", download.uri);

        // Verifica se o compartilhamento é suportado
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          // Compartilha o PDF
          await Sharing.shareAsync(download.uri);
        } else {
          console.log("Compartilhamento não disponível neste dispositivo");
        }
      } else {
        console.error("Falha ao baixar o PDF");
      }
    } catch (error) {
      console.error("Erro ao baixar e compartilhar o PDF:", error);
    }
  }
  redirectToEdit = () => {
    navigation.navigate("EquipmentSettings", { paramKey: id });
  };
  useEffect(() => {
    const params = route.params;
    if (params) {
      setNovo(false);
      idClient = route.params.paramKey;
      setId(idClient);
      fetch(FIND_BY_ID_CLIENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: idClient,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setEmail(json["email"]);
          setNome(json["name"]);
          setEndereco(json["address"]);
          setCpf(json["cpf"]);
          setTelefone(json["phone"]);
        });
      return () => {
        console.log("Componente desmontado!");
      };
    } else {
      setNovo(true);
      console.log("valor => " + id);
    }
  }, []);
  const geraPDF = () => {
    Linking.canOpenURL(
      "http://ec2-52-67-56-229.sa-east-1.compute.amazonaws.com:8080/download?id=" +
        id
    ).then((supported) => {
      if (supported) {
        Linking.openURL(
          "http://ec2-52-67-56-229.sa-east-1.compute.amazonaws.com:8080/download?id=" +
            id
        );
      } else {
        console.log("Don't know how to open URI: ");
      }
    });
  };
  const handleSubmit = () => {
    if (novo) {
      //move para outra tela
      idAux = 0;
      fetch(CREATE_CLIENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nome,
          address: endereco,
          cpf: String(cpf),
          phone: telefone,
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          idAux = json.id;

          navigation.navigate("Equipment", {
            paramKey: json.id,
            flagNovo: true,
          });
        });
    } else {
      fetch(UPDATE_CLIENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: idAux,
          name: nome,
          address: endereco,
          cpf: String(cpf),
          phone: telefone,
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setEmail(json["email"]);
          setNome(json["name"]);
          setEndereco(json["address"]);
          setCpf(json["cpf"]);
          setTelefone(json["phone"]);
        });
      alert("Cliente editado com sucesso!");
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Formulário de Cliente</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={15} // Limita o número de caracteres do CPF a 11
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Endereço"
          value={endereco}
          onChangeText={setEndereco}
        />

        <Button styles={styles.input} title="Enviar" onPress={handleSubmit} />

        <View style={stylesLink.container}>
          <Text>Detalhes do Equipamento!</Text>
          <TouchableOpacity onPress={redirectToEdit}>
            <Text style={stylesLink.link}>Clique aqui</Text>
          </TouchableOpacity>
        </View>

        <View style={stylesLink.container}>
          <Text>Gera PDF!</Text>
          <TouchableOpacity onPress={downloadAndSharePDF}>
            <Text style={stylesLink.link}>Clique aqui</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    // Para que os botões fiquem na horizontal
    justifyContent: "space-between", // Distribui o espaço igualmente entre os botões
    alignItems: "center",
    padding: 10,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
const stylesLink = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
export default Settings;
