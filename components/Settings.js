import React, { Component } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import TouchableBounce from "react-native/Libraries/Components/Touchable/TouchableBounce";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo";
import { List, Checkbox, IconButton } from "react-native-paper";
import { Button } from "react-native-paper";
import { ScrollView } from "react-native";
import {
  RadioButton,
  Text,
  Divider,
  TextInput,
  Portal,
  Modal
} from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { TriangleColorPicker } from "react-native-color-picker";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectTheme, saveTheme, deleteTheme } from "../actions/themesActions";
const uuidv4 = require("uuid/v4");
const tabBarIcon = name => ({ tintColor, horizontal }) => (
  <MaterialIcons name={name} color={tintColor} size={horizontal ? 17 : 24} />
);
class Settings extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      tabBarIcon: tabBarIcon("color-lens"),
      tabBarButtonComponent: TouchableBounce,
      tabBarColor: params.primary
    };
  };

  state = {
    value: this.props.theme.key,
    visible: false,
    primaryVisible: false,
    secondaryVisible: false,
    name: "",
    primary: "",
    secondary: ""
  };
  componentWillMount() {
    this.props.navigation.setParams({
      primary: this.props.theme.primary,
      secondary: this.props.theme.secondary
    });
  }
  componentDidMount() {
    console.log(this.props.navigation);
  }
  _showModalPrimary = () => this.setState({ primaryVisible: true });
  _hideModalPrimary = () => this.setState({ primaryVisible: false });
  _showModalSecondary = () => this.setState({ secondaryVisible: true });
  _hideModalSecondary = () => this.setState({ secondaryVisible: false });

  render() {
    console.log(this.props.themes);
    const dimensions = Dimensions.get("window");
    const screenWidth = dimensions.width;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.buildThemeStyle}>
          <List.Section title="Pridať novú farebnú tému" />
          <IconButton
            icon={!this.state.visible ? "expand-more" : "expand-less"}
            style={styles.iconStyle}
            color={this.props.theme.primary}
            size={30}
            onPress={() => this.setState({ visible: !this.state.visible })}
          />
        </View>
        <Divider />
        <View style={{ display: this.state.visible ? "flex" : "none" }}>
          <TextInput
            mode="outlined"
            label="Názov témy"
            style={styles.textInput}
            theme={{ colors: { primary: this.props.theme.primary } }}
            value={this.state.name}
            onChangeText={text => this.setState({ name: text })}
            onSubmitEditing={() => this.setState({ name: this.state.name })}
          />
          <View
            style={{
              flex: 1,
              margin: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Button
              mode="outlined"
              color={
                this.state.primary !== ""
                  ? this.state.primary
                  : this.props.theme.primary
              }
              onPress={() => this._showModalPrimary()}
            >
              Primárna farba
            </Button>
            <Button
              mode="outlined"
              color={
                this.state.secondary !== ""
                  ? this.state.secondary
                  : this.props.theme.secondary
              }
              onPress={() => this._showModalSecondary()}
            >
              Sekundárna farba
            </Button>
          </View>
          <View style={{ margin: 10 }}>
            <Button
              mode="contained"
              color={this.props.theme.primary}
              onPress={() => {
                if (
                  this.state.name !== "" &&
                  this.state.primary !== "" &&
                  this.state.primary !== ""
                ) {
                  this.props.saveTheme({
                    name: this.state.name,
                    primary: this.state.primary,
                    secondary: this.state.secondary,
                    key: uuidv4()
                  });
                  this.setState({ visible: false });
                }
              }}
            >
              Pridať
            </Button>
          </View>
          <Divider />
        </View>

        <ScrollView>
          <RadioButton.Group
            onValueChange={value => this.setState({ value })}
            value={this.state.value}
          >
            <FlatList
              style={{ flex: 1, width: screenWidth }}
              data={this.props.themes}
              renderItem={({ item }) => (
                <Animatable.View
                  animation={
                    this.state.value === item.key ? "pulse" : undefined
                  }
                >
                  <List.Item
                    key={item.key}
                    title={item.name}
                    onLongPress={() => {
                      console.log("press");
                    }}
                    onPress={() =>
                      this.props.selectTheme({
                        primary: item.primary,
                        secondary: item.secondary,
                        key: item.key
                      })
                    }
                    left={props => (
                      <View style={styles.radio}>
                        <RadioButton
                          {...props}
                          color={item.secondary}
                          uncheckedColor="gray"
                          value={item.key}
                          onPress={() => {
                            this.props.selectTheme({
                              primary: item.primary,
                              secondary: item.secondary,
                              key: item.key
                            });
                          }}
                        />
                      </View>
                    )}
                    right={props => (
                      <LinearGradient
                        colors={[item.primary, item.secondary]}
                        start={[0, 0]}
                        end={[1, 0]}
                        locations={[0.4, 0.9]}
                        style={{ flex: 0.4 }}
                      >
                        <View style={{ flex: 1, alignSelf: "center" }}>
                          <IconButton
                            {...props}
                            color="white"
                            icon="delete"
                            style={
                              item.name !== "Základná téma" &&
                              item.name !== "Obrátená základná téma"
                                ? { display: "flex" }
                                : { display: "none" }
                            }
                            onPress={() => this.props.deleteTheme(item)}
                          />
                        </View>
                      </LinearGradient>
                    )}
                  />
                  <Divider />
                </Animatable.View>
              )}
            />
          </RadioButton.Group>
        </ScrollView>

        <View />
        <Portal>
          <Modal
            style={{
              alignItems: "center",
              flex: 1,
              justifyContent: "center"
            }}
            visible={this.state.primaryVisible}
            onDismiss={this._hideModalPrimary}
          >
            <View style={{ height: Dimensions.get("window").height / 2 }}>
              <TriangleColorPicker
                style={{ flex: 1 }}
                oldColor={"#1a72b4"}
                onColorSelected={color => {
                  this.setState({ primary: color });
                  this._hideModalPrimary();
                }}
              />
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            style={{
              alignItems: "center",
              flex: 1,
              justifyContent: "center"
            }}
            visible={this.state.secondaryVisible}
            onDismiss={this._hideModalSecondary}
          >
            <View style={{ height: Dimensions.get("window").height / 2 }}>
              <TriangleColorPicker
                style={{ flex: 1 }}
                oldColor={"#B41A34"}
                onColorSelected={color => {
                  this.setState({ secondary: color });
                  this._hideModalSecondary();
                }}
              />
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  radio: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    color: "blue"
  },
  textInput: {
    margin: 10
  },
  buildThemeStyle: {
    marginTop: 17.5,
    marginRight: 0,
    marginBottom: 5,
    marginLeft: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch"
  },
  iconStyle: {
    marginTop: 17,
    marginBottom: 10
  }
});

const mapStateToProps = state => {
  return {
    theme: state.theme,
    themes: state.themes
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      selectTheme: selectTheme,
      saveTheme: saveTheme,
      deleteTheme: deleteTheme
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
//
// <Animatable.View
//   animation={this.state.value === "default" ? "pulse" : undefined}
// >
//   <List.Item
//     title="Základná téma"
//     left={props => (
//       <View style={styles.radio}>
//         <RadioButton
//           {...props}
//           color={this.props.theme.secondary}
//           uncheckedColor="gray"
//           value="default"
//           onPress={() => {
//             this.props.selectTheme({
//               primary: "#1a72b4",
//               secondary: "#B41A34",
//               key: uuidv4()
//             });
//           }}
//         />
//       </View>
//     )}
//   />
//   <Divider />
// </Animatable.View>
// <Animatable.View
//   animation={
//     this.state.value === "inverted" ? "pulse" : undefined
//   }
// >
//   <List.Item
//     title="Naopak"
//     left={props => (
//       <View style={styles.radio}>
//         <RadioButton
//           {...props}
//           color="#B41A34"
//           uncheckedColor="gray"
//           value="inverted"
//           onPress={() => {
//             this.props.selectTheme({
//               primary: "#B41A34",
//               secondary: "#1a72b4",
//               key: uuidv4()
//             });
//           }}
//         />
//       </View>
//     )}
//   />
// </Animatable.View>
