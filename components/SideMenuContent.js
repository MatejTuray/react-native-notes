import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'


export default class SideMenuContent extends Component {

  render() {
    
    return (
        <View style={styles.container}>
        <Text>
          Welcome to React Native!
        </Text>
        <Text>
          To get started, edit index.ios.js
        </Text>
        <Text >
          Press Cmd+R to reload,{'\n'}
          Cmd+Control+Z for dev menu
        </Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
    opacity: 1,
  },
});