import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { TextInput } from "react-native-paper";
import { Dimensions } from "react-native";
import { setTitle } from "../actions/notesActions";
import { bindActionCreators } from "redux";

class EditableHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: ""
    };
  }
  componentWillMount() {
    if (this.state.title === "") {
      this.setState({
        title: this.props.titleText
      });
    }
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <TextInput
          theme={{ colors: { primary: this.props.color } }}
          label="Názov"
          style={styles.inputStyle}
          value={this.state.title}
          onChangeText={title => this.setState({ title: title })}
          onSubmitEditing={() => {
            this.props.setTitle(this.state.title);
            this.props.setHeader(this.state.title);
          }}
          mode="flat"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    width: Dimensions.get("window").width,
    color: "white"
  },
  inputStyle: {
    alignSelf: "stretch",
    backgroundColor: "white"
  }
});
const mapStateToProps = state => ({
  title: state.title
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setTitle: setTitle }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableHeader);
