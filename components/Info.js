import React, { Component } from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import { connect } from "react-redux";
import { List, Button } from "react-native-paper";
import TouchableBounce from "react-native/Libraries/Components/Touchable/TouchableBounce";
import { MaterialIcons } from "@expo/vector-icons";
import { Constants, WebBrowser } from "expo";
const tabBarIcon = name => ({ tintColor, horizontal }) => (
  <MaterialIcons name={name} color={tintColor} size={horizontal ? 17 : 24} />
);
const link = "https://react-native-notesapi.herokuapp.com/privacy-policy";
class Info extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      tabBarIcon: tabBarIcon("info"),
      tabBarButtonComponent: TouchableBounce,
      tabBarColor: params.primary
    };
  };
  _handlePressButtonAsync = async link => {
    let result = await WebBrowser.openBrowserAsync(link);
    this.setState({ result });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <List.Section title="Autor: Matej Turay" />
        </View>
        <View>
          <Button
            color={this.props.theme.primary}
            icon="important-devices"
            onPress={() => {
              this._handlePressButtonAsync(link);
            }}
          >
            Podmienky používania
          </Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  text: {
    margin: 15,
    textAlign: "justify"
  }
});
const mapStateToProps = state => {
  return {
    theme: state.theme
  };
};
export default connect(
  mapStateToProps,
  null
)(Info);
