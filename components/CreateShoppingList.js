import React, { Component } from 'react'
import { View, StyleSheet, DatePickerAndroid, ScrollView, TimePickerAndroid, Dimensions } from 'react-native'
import { TextInput } from 'react-native-paper';
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { saveNote } from "../actions/notesActions"
import moment from "moment"
import AppBar from "./AppBar";
import { List, Checkbox, IconButton, Switch, Snackbar, Portal } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { ColorWheel } from 'react-native-color-wheel';
const uuidv1 = require('uuid/v1')
const convert = require('color-convert');

class CreateShoppingList extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    console.log(params)

    return {
      title: 'Create a list',
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
    this.handleSaveNote = this.handleSaveNote.bind(this)
    this.datePicker = this.datePicker.bind(this)
    this._handleDatePicked = this._handleDatePicked.bind(this)
    this._hideDateTimePicker = this._hideDateTimePicker.bind(this)   
    
    this.state = {
      text: "",
      date: new Date(),
      title: "",
      list: [],
      snackBarVisible: false,
      remind: false,
      reminderDate: "",

    }
  }
  handleSaveNote() {  

    let payload = {
      key: uuidv1(),
      date: this.state.date,
      title: this.state.title,
      list: this.state.list,
      remind: this.state.remind,
      reminderDate: this.state.reminderDate,
      color: this.state.color
  }
  console.log(payload)
    this.setState({
      redirect: true
    })
    this.props.saveNote(payload)
  }
  _hideDateTimePicker = () => this.setState({ openDateTime: false, remind: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this._hideDateTimePicker();
    this.setState({
      snackBarVisible: true,
      reminderDate: date, 
      remind: true,
    })
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
        try {
          const { action, hour, minute } = await TimePickerAndroid.open({

            is24Hour: true, // Will display '2 PM'
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
    let time = moment(this.state.time, "HH:MM")
    time = moment(time).format("HH:MM")
    return (

      <View style={styles.viewStyle}>
        <View style={styles.dateStyle}>
          <View style={styles.dateEditStyle}>

            <List.Section style={styles.textStyle} title={`${moment(this.state.date).format("LL")} / ${this.state.time ? this.state.time : moment(new Date()).format("HH:MM")}`} />
            <IconButton
              style={styles.iconStyle}
              icon="edit"

              size={20}
              onPress={() => this.datePicker()}
            />
          </View>

          <View style={styles.remindStyle}>

            <IconButton
              style={styles.remindIconStyle}
              color={this.state.remind ? "green" : "black"}
              icon="notifications"
              size={20}
              onPress={() => this.setState({remind: true, openDateTime: true})}
            />

            <Switch
              value={this.state.remind}
              color="#1a72b4"
              onValueChange={() => { this.setState({ remind: !this.state.remind, openDateTime: true}  ); }
              }
            />
          </View>
        </View>
        <View style={styles.inputStyle}>
          <TextInput
            label='List title'
            value={this.state.title}
            onChangeText={title => this.setState({ title })}
            mode="outlined"

          />
        </View>
        <View style={styles.inputStyle}>
          <TextInput
            label='List item'
            value={this.state.text}
            onChangeText={text => {
              this.setState({ text }); this.setState({
                expanded: true
              })
            }}
            onSubmitEditing={() => {
              this.setState({
                list: this.state.list.concat({text: this.state.text, status: false})
              }); console.log(this.state.list); this.setState({
                text: ""
              })
            }}
            mode="outlined"

          />
        </View>
        <ScrollView style={styles.scrollStyle}>
          <List.Accordion
            title={this.state.title}
            left={props => <List.Icon  {...props} icon="assignment" />}
            expanded={this.state.expanded}
            onPress={() => this.setState({
              expanded: !this.state.expanded
            })}
          >
            {this.state.list.map((item) => <List.Item style={styles.listItemStyle} key={uuidv1()} title={item.text} left={props => <Checkbox.Android {...props} />} />)}
          </List.Accordion>


        </ScrollView>
        <ColorWheel
          initialColor="#ee0000"
          onColorChange={(color) => {let clr = convert.hsv.hex(color.h, color.s, color.v); console.log(clr); this.props.navigation.setParams({color: clr}); this.setState({
            color: clr
          })}}
          style={{width: Dimensions.get('window').width}}
          thumbStyle={{ height: 15, width: 15, borderRadius: 30}} />
        <View style={styles.AppBarStyle}>
          <AppBar openDatePicker={this.datePicker} handleSaveNote={this.handleSaveNote} />
        </View>
        <DateTimePicker
          isVisible={this.state.remind && this.state.openDateTime}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="datetime"
        />
      
        <Snackbar
          visible={this.state.snackBarVisible}
          onDismiss={() => this.setState({ snackBarVisible: false })}
          style={styles.snackbarStyle}
          duration={5000}   
        
        >       
          Reminder: {moment(this.state.reminderDate).format("DD/MM/YYYY HH:mm")}
            
        
        </Snackbar>
        <Snackbar
          visible={this.state.redirect}
          onDismiss={() => {this.setState({ redirect: false }); this.props.navigation.navigate("Home")}}
          style={styles.snackbarStyle}
          duration={3000}   
        
        >       
          List saved...
            
        
        </Snackbar>
        
      </View>


    )
  }
}
const styles = StyleSheet.create({
  viewStyle: {

    flex: 1,
  },
  inputStyle: {
    margin: 10,

  },
  scrollStyle: {
    lineHeight: 1,
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
  listItemStyle: {
    lineHeight: 0.5,
    marginLeft: 60,
  },
  dateStyle: {
    marginTop: 17.5,
    margin: 10,
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
    
  }



})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ saveNote: saveNote }, dispatch)
}

export default connect(null, mapDispatchToProps)(CreateShoppingList)