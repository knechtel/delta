import React, { Component } from "react";

import {
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Button,
  Animated,
  View,
  Image,
  Dimensions,
  Linking,
} from "react-native";

import axios from "axios";
import { FIND_ALL_CLIENT } from "../util/urls";
const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

class ClientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: [],
      refreshing: false,
      scrollY: new Animated.Value(0),
      id: null,
    };
  }
  handleNavigation = (id) => {};
  handleClick = () => {};
  redirectToEditEquipment = (id) => {};
  _onRefresh = () => {
    this.setState({ refreshing: true });
    axios.get(FIND_ALL_CLIENT).then((response) => {
      this.setState({
        client: response.data,
      });
      this.setState({ refreshing: false });
    });
  };

  componentDidMount() {
    axios.get(FIND_ALL_CLIENT).then((response) => {
      this.setState({
        client: response.data,
      });
    });
  }
  alertItemName = (item) => {
    this.setState({ refreshing: false });
    this.redirectToEditEquipment(item.id);
  };
  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp",
    });

    const headerOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [0, -HEADER_MAX_HEIGHT + HEADER_MIN_HEIGHT],
      extrapolate: "clamp",
    });
    const scrollViewMarginTop = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp",
    });

    return (
      <>
        <View style={styles.container}>
          {/* Cabeçalho animado */}
          <Animated.View
            style={[
              styles.header,
              {
                height: headerHeight,
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslate }],
              },
            ]}
          >
            <Image
              source={require("../assets/eletronica1.png")}
              style={styles.headerImage} // Estilo da imagem
            />
          </Animated.View>

          <Animated.ScrollView
            style={[styles.scrollView, { marginTop: scrollViewMarginTop }]}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            {this.state.client.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.squareContainer}
                onPress={() => this.alertItemName(item)}
              >
                <Text style={styles.text}>
                  {item.name} - {item.id}{" "}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
          <Button
            onPress={this.handleClick}
            title="Adicionar equipamento"
            color="#841584"
          />
        </View>
      </>
    );
  }
}

export default ClientList;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 3,
    backgroundColor: "#d9f9b1",
    flex: 1,
  },
  squareContainer: {
    alignItems: "center",
    backgroundColor: "#d9f9b1",
    borderRadius: 10, // Borda arredondada
    padding: 15,
    marginVertical: 5, // Espaço entre os quadrados
    marginHorizontal: 10, // Margem nas laterais
    elevation: 3, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "dodgerblue",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  headerImage: {
    width: SCREEN_WIDTH, // Largura da imagem
    height: HEADER_MAX_HEIGHT, // Altura da imagem
    //  borderRadius: 25, // Deixa a imagem redonda, caso seja quadrada
    //  marginBottom: 10, // Espaço entre a imagem e o texto
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    //  marginTop: HEADER_MAX_HEIGHT, // Para evitar que o conteúdo fique atrás do cabeçalho
  },

  content: {
    padding: 20,
  },
  textContent: {
    fontSize: 16,
    marginVertical: 20,
  },
});
