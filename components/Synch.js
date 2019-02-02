import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import TouchableBounce from "react-native/Libraries/Components/Touchable/TouchableBounce";
import { MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
const tabBarIcon = name => ({ tintColor, horizontal }) => (
  <MaterialIcons name={name} color={tintColor} size={horizontal ? 17 : 24} />
);
class Synch extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      tabBarIcon: tabBarIcon("sync"),
      tabBarButtonComponent: TouchableBounce,
      tabBarColor: params.primary
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({
      primary: this.props.theme.primary,
      secondary: this.props.theme.secondary
    });
  }
  render() {
    return (
      <View>
        <Text> Synch </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
const mapStateToProps = state => {
  return {
    theme: state.theme
  };
};

export default connect(
  mapStateToProps,
  null
)(Synch);
