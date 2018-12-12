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
import {selectNote, deleteNote} from "../actions/notesActions"
import {bindActionCreators} from "redux";




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
    this.handleDelete = this.handleDelete.bind(this)

    this.state = {
      text: "",
      title: "",
      selected: [],
      change: false
      
    }
    
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
  handleDelete(){ 
    for(let elem of this.state.selected){
    this.props.deleteNote(elem)
    }
    this.setState({
      selected: []
    })   
    this.props.navigation.setParams({len: 0})    
    
       
        
        
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
 
  
    let swipeoutBtnsRight = [
      {
        text: 'Delete',
        onPress:() => {this.props.deleteNote(this.props.selectedNote)},
        type: "delete",
      }
    ]
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
          <Swipeout onOpen={() => this.props.selectNote(item)} right={swipeoutBtnsRight}>
          <List.Item
          key={item.key}
          title={item.title}
          description={item.text}
          style={this.state.selected.includes(item) ?  "#b2b2b2" : item.color && item.color !== "#1a72b4" ? {backgroundColor: `${item.color}`, opacity: 0.9} : {backgroundColor: `#ffffff`}} 
          onPress={() => {this.props.selectNote(item); this.props.navigation.navigate("Details", {title: item.title, color: item.color})}}
          onLongPress={() => {this.handleSelect(item);this.props.navigation.setParams({len: this.state.selected.length})}}         
          left={props => <List.Icon {...props} icon={item.text? "note" : "list" } 
          
          />}
            
          />
        
          <Divider/>
          </Swipeout>   
        )}
        />
      </ScrollView>
    

        <View style={styles.container}><FabComponent navigation={this.props.navigation} />
        
        </View>
        {this.state.selected.length > 0  && this.state.selected !== [] ? <HomeAppBar openDatePicker={this.datePicker} handleDelete={this.handleDelete}/>: undefined}
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
  notes: state.notes,
  selectedNote: state.selectedNote,
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({selectNote: selectNote, deleteNote: deleteNote}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)