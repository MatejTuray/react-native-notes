import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
import { List, Divider } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import axios from "axios";
const uuidv4 = require("uuid/v4");
import { Constants, WebBrowser } from "expo";

export default class Letaky extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: "Aktuálne letáky",
      headerStyle: {
        backgroundColor: "#1a72b4"
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      }
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false
    };
  }
  _handlePressButtonAsync = async link => {
    let result = await WebBrowser.openBrowserAsync(link);
    this.setState({ result });
  };

  componentWillMount() {
    this.setState({
      loading: true
    });
    axios
      .get("https://react-native-notesapi.herokuapp.com/api/letaky")
      .then(res => {
        this.setState({
          data: res.data.list,
          loading: false
        });
      })
      .catch(e => console.log(e));
  }

  render() {
    return (
      <View
        style={
          !this.state.loading
            ? styles.container
            : {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }
        }
      >
        {this.state.loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
            }}
          >
            <ActivityIndicator size={200} color="#1a72b4" />
          </View>
        ) : (
          <ScrollView style={styles.scrollStyle}>
            <FlatList
              data={this.state.data}
              style={styles.listitemStyle}
              renderItem={({ item }) => (
                <Animatable.View animation="slideInLeft">
                  <List.Item
                    key={uuidv4()}
                    onPress={() => this._handlePressButtonAsync(item.link)}
                    left={props => (
                      <Image
                        {...props}
                        source={{ uri: item.logo }}
                        style={{ width: 300, height: 150, marginLeft: 30 }}
                      />
                    )}
                  />
                  <Divider />
                </Animatable.View>
              )}
            />
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  scrollStyle: {
    lineHeight: 1
  },
  listitemStyle: {
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  }
});
