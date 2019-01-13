import * as React from "react";
import { Appbar } from "react-native-paper";
import { AppRegistry, StyleSheet } from "react-native";
export default class DetailsAppBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      voice: false
    };
  }

  render() {
    console.log(this.props.totalPrice)
    return (
      <Appbar
        style={
          this.props.color
            ? { backgroundColor: `${this.props.color}` }
            : "#1a72b4"
        }
      >
        <Appbar.Action
          color="white"
          icon="share"
          onPress={() => this.props.handleShare()}
        />
        <Appbar.Action
        color="white"
        icon={"menu"}
        onPress={() => this.props.handleHideMenu()}
      />
      <Appbar.Action
      color="white"
      icon={"color-lens"}
      onPress={() => this.props.openModal()}
    />

     
      </Appbar>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  }
});

AppRegistry.registerComponent("detailsappbar", () => <DetailsAppBar />);
