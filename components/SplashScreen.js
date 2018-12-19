import React, { Component } from 'react'
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native'

export default class SplashScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={200} color="white" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a72b4",
        justifyContent: "center",
        alignItems: "center"
      },
})
