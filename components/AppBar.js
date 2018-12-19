import * as React from "react";
import { Appbar } from "react-native-paper";
import { AppRegistry, StyleSheet, View } from "react-native";
export default class AppBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      voice: false
    };
  }

  render() {
    return (
      <Appbar
        style={
          this.props.color
            ? { backgroundColor: `${this.props.color}` }
            : { backgroundColor: "#1a72b4" }
        }
      >
        <Appbar.Action
          color="white"
          icon="color-lens"
          onPress={() => this.props.openModal()}
        />
        <Appbar.Action
          color="white"
          icon={this.state.voice ? "mic-off" : "mic"}
          onPress={() => {
            this.setState({
              voice: !this.state.voice
            });
          }}
        />
        {this.props.handleDelete ?  <Appbar.Action
          color="white"
          icon="delete"
          onPress={() => this.props.handleDelete()}
        />: undefined}
        <Appbar.Action
          color="white"
          icon="date-range"
          onPress={() => this.props.openDatePicker()}
        />
        {this.props.totalPrice ? (
          <Appbar.Content
            title={`${
              this.props.totalPrice && this.props.totalPrice.length > 0
                ? Math.round(
                    parseFloat(
                      (
                        this.props.totalPrice.reduce((p, c) => p + c) *
                        Math.pow(10, 2)
                      ).toFixed(2)
                    )
                  ) / Math.pow(10, 2)
                : 0
            } €`}
            titleStyle={{ color: "white" }}
            subtitle={"Total price"}
            subtitleStyle={{ color: "white" }}
          />
        ) : (
          undefined
        )}
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

AppRegistry.registerComponent("appbar", () => <Appbar />);
