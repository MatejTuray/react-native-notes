import React, { Component } from 'react'
import { StyleSheet, View, Vibration } from 'react-native';
import { Text, } from 'react-native-paper';
import moment from "moment";
import FabComponent from './FabComponent';
import HomeAppBar from './HomeAppBar';
import { DatePickerAndroid, TouchableOpacity } from "react-native"
import { Searchbar, List, Divider,ProgressBar } from 'react-native-paper';
import {connect} from "react-redux";
import Swipeout from 'react-native-swipeout';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import {selectNote} from "../actions/notesActions"
import {bindActionCreators} from "redux";

let swipeoutBtnsRight = [
  {
    text: 'Right Button'
  }
]
let swipeoutBtnsLeft = [
  {
    text: 'Left Button'
  }
]

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params && params.len > 0? `${params.len.toString()}`: 'Home',
      headerStyle: {
        backgroundColor: params && params.len > 0 ? "grey" : '#1a72b4',
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      }
    }
  };

  constructor(props) {
    super(props)
    this.datePicker = this.datePicker.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.state = {
      text: "",
      title: "",
      selected: [],
      change: false
      
    }
    
  }
  componentDidMount(){
   
  }
  componentDidUpdate(){
   
  }
  handleSelect(item){
    
    if (this.state.selected.includes(item)){     
      this.setState({
        selected: this.state.selected.filter(obj => obj.key !== item.key),        
      })
    }
    else{
    this.setState({
      selected: this.state.selected.concat(item),
      change: true
    })
  }
    Vibration.vibrate(50)
}

  async datePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.state.date,
        minDate: new Date()
      });

      if (action === DatePickerAndroid.dateSetAction) {
        let dateString = `${day}-${month + 1}-${year}`
        let dateObj = moment(dateString, "DD-MM-YYYY").toDate()
        console.log(dateString)
        console.log("////")
        console.log(dateObj)
        this.setState({
          date: dateObj
        })
      }

    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  render() {
 
    
    return (


      <View style={styles.container}>

        <View style={styles.headerStyle}>
          <Searchbar
            placeholder="Search"
            onChangeText={query => { this.setState({ firstQuery: query }); }}
            value={this.state.firstQuery}
          />
          {/* <Text style={styles.textStyle}>Your notes for {moment(this.state.date).format("LL")} </Text> */}
        </View>       
      
          
        <ScrollView>
        <FlatList
        data={this.props.notes}
        renderItem={({ item }) => (
          <Swipeout right={swipeoutBtnsRight} left={swipeoutBtnsLeft}>
          <List.Item
          key={item.key}
          title={item.title}
          description={item.text}
          style={this.state.selected.includes(item) ? {backgroundColor: "grey"} : {backgroundColor: `#${item.color}`} }
          onPress={() => {this.props.selectNote(item); this.props.navigation.navigate("Details", {title: item.title})}}
          onLongPress={() => {this.handleSelect(item);this.props.navigation.setParams({len: this.state.selected.length})}}         
          left={props => <List.Icon {...props} icon={item.text? "note" : "list" }     
          />}
          />
        
          <Divider/>
          </Swipeout>   
        )}
        />
      </ScrollView>
    

        <View style={styles.container}><FabComponent navigation={this.props.navigation} /></View>
        {this.state.selected.length > 0 ? <Animatable.View animation="fadeInUp"><HomeAppBar openDatePicker={this.datePicker} /></Animatable.View>: undefined}
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  textStyle: {
    marginTop: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  navBarStyle: {
    marginTop: 55,
    paddingTop: 15,
  },
  headerStyle: {
    display: "flex",
    justifyContent: "center",


  },
  


});
const mapStateToProps = (state) => {
  return{
  notes: state.notes
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({selectNote: selectNote}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)