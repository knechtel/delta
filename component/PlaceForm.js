import { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from "react-native";

import { Colors } from "../constants/colors";
import ImagePicker from "./ImagePicker";
import { Place } from "../models/Place";
function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  //const [pickedLocation, setPickedLocation] = useState();

  function takeImageHandler(imageUri) {
    console.log("maiquel1234");
    console.log(imageUri);
    setSelectedImage(imageUri);
  }
  // const pickLocationHandler = useCallback((location) => {
  //   setPickedLocation(location);
  // }, []);
  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }
  function savePlaceHandler() {
    const placeData = new Place(enteredTitle, selectedImage);
    onCreatePlace(placeData);
  }
  return (
    <>
      <ScrollView styles={styles.form}>
        <View>
          <Text style={styles.label}>Numero da Ordem de Serviço</Text>
          <TextInput
            style={styles.input}
            onChangeText={changeTitleHandler}
            value={enteredTitle}
          />
        </View>
        <ImagePicker />
      </ScrollView>
    </>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
