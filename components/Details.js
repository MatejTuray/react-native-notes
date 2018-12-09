import React, { Component } from 'react'
import { View, Text, StyleSheet, DatePickerAndroid, TimePickerAndroid, } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import {bindActionCreators} from "redux"
import DetailsAppBar from "./DetailsAppBar"
import * as Animatable from 'react-native-animatable';
import { TextInput } from 'react-native-paper';
import { List, Checkbox, IconButton, Divider, ProgressBar} from 'react-native-paper';
import Swipeout from 'react-native-swipeout';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import update from 'immutability-helper';
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

class Details extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;    

    return {
      title: params.title ? `${params.title}`: 'Home',
      headerStyle: {
        backgroundColor: params && params.color? `#${params.color}` : '#1a72b4',
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      }
    }
  };
  constructor(props) {
    super(props)
    this.handleCheck = this.handleCheck.bind(this)
    this.state = {
       text: "",
       list: []
    }
  }
  componentDidMount(){
    this.setState({
      text: this.props.note.text,
      list: this.props.note.list
    })
  }
  handleCheck(item){
    this.setState(prevState => ({
      list: prevState.list.map(
      obj => (obj.text === item.text ? Object.assign(obj, { status: !obj.status }) : obj)
    )
     }));
  }

  async datePicker() {
    let timeString
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
        try {
          const { action, hour, minute } = await TimePickerAndroid.open({

            is24Hour: true,
          });
          if (action !== TimePickerAndroid.dismissedAction) {

            if (minute > 10) {
              timeString = `${hour}:${minute}`
            }
            else {
              timeString = `${hour}:0${minute}`
            }
            console.log(timeString)
            this.setState({
              time: timeString
            })
          }
        } catch ({ code, message }) {
          console.warn('Cannot open time picker', message);
        }
      }

    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        
      {this.props.note.text? 
        <TextInput style={styles.textStyle}
            label='Note'
            value={this.state.text}
            onChangeText={text => this.setState({ text })}
            mode="outlined"
            multiline={true}
            numberOfLines={12}
          />
        :
        <ScrollView style={styles.scrollStyle}>
        <FlatList
        data={this.state.list}
        renderItem={({ item }) => (
          <Swipeout right={swipeoutBtnsRight} left={swipeoutBtnsLeft}>
          <List.Item
          key={this.props.note.key * this.props.note.list.indexOf(item)} 
          title={item.text}                                 
          onPress={() => {console.log("short press"); this.handleCheck(item);}}
          onLongPress={() => {console.log("long press details", item.status)}}         
          left={props => <Checkbox.Android {...props} status={item.status ? "checked" : "unchecked"} color="green"/>}     
          />
          
        
          <Divider/>
          </Swipeout>   
        )}
        />

        </ScrollView>
      }
        <View style={styles.snackbarStyle}>
        <ProgressBar progress={this.state.list.filter((item) => item.status === true).length / this.state.list.length} color={`#${this.props.note.color}`} style={styles.ProgressBarStyle}/>
        </View>
        <View style={styles.AppBarStyle}>
            <Animatable.View animation="bounceInLeft"><DetailsAppBar openDatePicker={this.datePicker}/></Animatable.View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  viewStyle: {

    flex: 1,
  },
  viewButtonStyle: {
    borderRadius: 5,


  },
  ProgressBarStyle:{
    margin: 20,

  },
  inputStyle: {
    margin: 10,

  },
  titleStyle: {
    marginBottom: 20,
  },
  buttonStyle: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderColor: "blue",
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  AppBarStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

  },
  dateStyle: {
    marginTop: 17.5,
    margin: 10,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",

  },
  textStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: -5,
  },
  iconStyle: {
    marginTop: 17,
    marginBottom: 10,
  },
  remindIconStyle: {
    marginTop: 17,
    marginBottom: 10,
  },
  dateEditStyle: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  remindStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  snackbarStyle:{
    position: 'absolute',  
    left: 0,
    right: 0,
    bottom: 55,
    zIndex: 200,
    margin: 0,
    padding: 0,
    borderRadius: 0,
    
  },
  scrollStyle: {
    lineHeight: 1,
  },


})

const mapStateToProps = (state) => {
  return{
  note: state.selectedNote
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({})
}

export default connect(mapStateToProps, mapDispatchToProps)(Details)
