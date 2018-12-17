import * as React from 'react';
import { FAB, Portal } from 'react-native-paper';
import {StyleSheet} from "react-native"
export default class MyComponent extends React.Component {
  state = {
    open: false,
  };

  render() {
    return (
      <Portal style={styles.PortalStyle}>
        <FAB.Group
          style={styles.fabStyle}
          open={this.state.open}
          icon={this.state.open ? 'today' : 'menu'}
          theme={{ colors: {accent: "#B41A34"}}}
          actions={[
            { icon: 'note-add', label: "Create a note", style: {
              backgroundColor: "#B41A34",
            }, onPress: () => this.props.navigation.navigate("CreateNote", {edit: false, titleText: "Untitled"}) },
            { icon: 'playlist-add', label: 'Create a list', style: {
              backgroundColor: "#B41A34",
            }, onPress: () => this.props.navigation.navigate("CreateShoppingList", {edit: false, titleText: "Untitled"})},
            { icon: 'email', label: 'Email', style: {
              backgroundColor: "#B41A34",
            },onPress: () => console.log('Pressed email') },
            { icon: 'notifications', label: 'Remind', style: {
              backgroundColor: "#B41A34",
            },onPress: () => console.log('Pressed notifications') },
          ]}
          onStateChange={({ open }) => this.setState({ open })}
          onPress={() => {
            if (this.state.open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    );
  }
}
const styles = StyleSheet.create({
  fabStyle:{    
    paddingBottom: 60,
    marginBottom: 0,
   
  },
  PortalStyle:{
    color: "#aa6a39",
    marginBottom: 0,
    paddingBottom: 60,
  }
})