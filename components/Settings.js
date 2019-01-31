import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import TouchableBounce from "react-native/Libraries/Components/Touchable/TouchableBounce";
import { MaterialIcons } from "@expo/vector-icons";
import { List, Checkbox, IconButton } from "react-native-paper";
import { Button } from "react-native-paper";
import { ScrollView } from "react-native";
import { RadioButton, Text, Divider, TextInput } from "react-native-paper";
import * as Animatable from "react-native-animatable";
const tabBarIcon = name => ({ tintColor, horizontal }) => (
  <MaterialIcons name={name} color={tintColor} size={horizontal ? 17 : 24} />
);
export default class Settings extends Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon("settings"),
    tabBarButtonComponent: TouchableBounce
  };
  state = {
    value: "first",
    visible: false
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.buildThemeStyle}>
          <List.Section title="Pridať novú farebnú tému" />
          <IconButton
            icon={!this.state.visible ? "expand-more" : "expand-less"}
            style={styles.iconStyle}
            color="#B41A34"
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
              color="#1a72b4"
              onPress={() => console.log("primary pressed")}
            >
              Primárna farba
            </Button>
            <Button
              mode="outlined"
              color="#B41A34"
              onPress={() => console.log("secondary pressed")}
            >
              Sekundárna farba
            </Button>
          </View>
          <View style={{ margin: 10 }}>
            <Button
              mode="contained"
              color="#1a72b4"
              onPress={() => this.setState({ visible: false })}
            >
              Pridať
            </Button>
          </View>
          <Divider />
        </View>

        <ScrollView style={styles.themeBuilder}>
          <List.Section title="Farebné témy">
            <RadioButton.Group
              onValueChange={value => this.setState({ value })}
              value={this.state.value}
            >
              <Animatable.View
                animation={this.state.value === "first" ? "pulse" : undefined}
              >
                <List.Item
                  title="First Item"
                  description="Item description"
                  left={props => (
                    <View style={styles.radio}>
                      <RadioButton
                        {...props}
                        color="#B41A34"
                        uncheckedColor="gray"
                        value="first"
                      />
                    </View>
                  )}
                />
                <Divider />
              </Animatable.View>
              <List.Item
                title="First Item"
                description="Item description"
                left={props => (
                  <View style={styles.radio}>
                    <RadioButton
                      {...props}
                      color="#B41A34"
                      uncheckedColor="gray"
                      value="second"
                    />
                  </View>
                )}
              />
              <Divider />
            </RadioButton.Group>
          </List.Section>
        </ScrollView>
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
