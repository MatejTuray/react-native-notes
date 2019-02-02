import React, { Component } from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
const SplashScreen = props => {
  return (
    <View style={[styles.container, { backgroundColor: props.theme.primary }]}>
      <ActivityIndicator size={200} color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
)(SplashScreen);
