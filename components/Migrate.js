import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import TouchableBounce from "react-native/Libraries/Components/Touchable/TouchableBounce";
import { MaterialIcons } from "@expo/vector-icons";
const tabBarIcon = name => ({ tintColor, horizontal }) => (
  <MaterialIcons name={name} color={tintColor} size={horizontal ? 17 : 24} />
);
export default class Migrate extends Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon("cloud-upload"),
    tabBarButtonComponent: TouchableBounce
  };
  render() {
    return (
      <View>
        <Text> Migrate </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
