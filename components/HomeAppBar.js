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
     <Appbar.Action icon="date-range" color="white" onPress={() => this.props.openDatePicker()}/>
        <Appbar.Action  color="white" icon={this.state.list ? "view-list" : "view-module"} onPress={() => {console.log('Pressed switch view'); this.setState({list: !this.state.list})}} />
        <Appbar.Action  color="white" icon="share" onPress={() => console.log('Pressed mail')} />   
        <Appbar.Action  color="white" icon="delete" onPress={() => console.log('Pressed delete')} />   
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