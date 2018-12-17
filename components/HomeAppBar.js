import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { AppRegistry, StyleSheet } from 'react-native';
export default class HomeAppBar extends React.Component {
    constructor(props) {
      super(props)
    
      this.state = {
         voice: false,
         list: true
      }
    }
    
  render() {
    return (
       
      <Appbar style={styles.bottom}>             
        <Appbar.Action  color="white" icon="share" onPress={() => console.log('Pressed mail')} />   
        <Appbar.Action  color="white" icon="delete" onPress={() => {this.props.handleDelete()}} /> 
        <Appbar.Action  color="white" icon="archive" onPress={() => {this.props.handleArchive()}} /> 
      </Appbar>
      
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: "grey",
    color: "white",
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

AppRegistry.registerComponent("homeappbar", () => <HomeAppBar/>);