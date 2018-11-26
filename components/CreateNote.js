import React, { Component } from 'react'
import { View, StyleSheet, DatePickerAndroid, TimePickerAndroid} from 'react-native'
import { TextInput } from 'react-native-paper';
import { Text, TouchableRipple} from 'react-native-paper'
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {saveNote} from "../actions/notesActions"
import moment from "moment"
import AppBar from "./AppBar";
import { List, Checkbox } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';

class CreateNote extends Component {
    constructor(props) {
      super(props)
      this.handleSaveNote = this.handleSaveNote.bind(this)
      this.datePicker = this.datePicker.bind(this)
      this.state = {
         text: "",
         date: new Date(),
         
    }
  }
    handleSaveNote(){
      console.log(this.state.text)

    }
    async datePicker(){
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({           
            date: this.state.date,
            minDate: new Date()
        });

        if(action === DatePickerAndroid.dateSetAction){
            let dateString = `${day}-${month+1}-${year}`
            let dateObj = moment(dateString, "DD-MM-YYYY").toDate()
            console.log(dateString)
            console.log("////")
            console.log(dateObj)
            this.setState({
                date: dateObj
            })
            try {
             const {action, hour, minute} = await TimePickerAndroid.open({
               
               is24Hour: true, // Will display '2 PM'
             });
             if (action !== TimePickerAndroid.dismissedAction) {
               let timeString = `${hour}:${minute}`              
               this.setState({
                   time:timeString
               })
             }
           } catch ({code, message}) {
             console.warn('Cannot open time picker', message);
           }
        }

    } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
    }   
}
 
    
  render() {
    return (

      <View style={styles.viewStyle}>
        <View style={styles.inputStyle}>
        <List.Section title={`Your list for ${moment(this.state.date).format("LL")} / ${this.state.time ? this.state.time : moment(new Date()).format("HH:MM")}`}/>
        <TextInput
             label='Note'
             value={this.state.text}
             onChangeText={text => this.setState({ text })}
             mode="outlined"
             multiline={true}
             numberOfLines={12}
        />     
        </View>      
        
     <View style={styles.AppBarStyle}>
              <AppBar openDatePicker={this.datePicker}/>
      </View>
      </View>
      
    
    )
  }
}
const styles = StyleSheet.create({
    viewStyle:{
        
        flex: 1,
    },
    viewButtonStyle:{
      borderRadius: 5,
   

    },  
    inputStyle:{
      margin: 10
    },
    buttonStyle:{
      marginTop: 20,
      padding: 10,
      borderRadius: 5,
      borderColor: "blue",
      borderWidth: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    AppBarStyle:{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
           
    }


})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({saveNote: saveNote}, dispatch)
}

export default connect(null,mapDispatchToProps)(CreateNote)