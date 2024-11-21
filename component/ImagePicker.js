import { Alert, Image, StyleSheet, Text, View, Button } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState } from "react";
import axios from "axios";
import { Colors } from "../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";
//import { Button } from "react-native-paper";

function ImagePicker() {
  const [pickedImage, setPickedImage] = useState();

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  const sendToServer = async () => {
    try {
      // Criar um FormData para enviar o arquivo
      const formData = new FormData();

      // Adicionar o arquivo ao FormData
      formData.append("file", {
        uri: pickedImage, // Caminho do arquivo local (deve começar com file:// para iOS/Android)
        name: "arquivo.jpg", // Nome do arquivo
        type: "image/jpeg", // Tipo MIME do arquivo
      });

      // Configurar cabeçalhos
      const headers = {
        "Content-Type": "multipart/form-data",
      };

      // Fazer a requisição POST para enviar o arquivo
      const response = await axios.post("url.Servidor", formData, { headers });

      console.log("Resposta do servidor:", response.data);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error.message);
    }
  };

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app."
      );
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    var result = image;
    console.log(result.assets[0].uri);

    setPickedImage(result.assets[0].uri);
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
      <Button title="Enviar" onPress={sendToServer} />
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
