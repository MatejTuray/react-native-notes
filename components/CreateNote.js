

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  DatePickerAndroid,
  TimePickerAndroid,
  Dimensions
} from "react-native";
import { TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { saveNote, cacheText, clearCacheNote, setTitle } from "../actions/notesActions";
import moment from "moment";
import AppBar from "./AppBar";
import {
  List,
  IconButton,
  Switch,
  Snackbar,
  Modal,
  Portal,
  HelperText
} from "react-native-paper";
import DateTimePicker from "react-native-modal-datetime-picker";
import { TriangleColorPicker } from "react-native-color-picker";
import { Notifications } from "expo";
import { MaterialHeaderButtons, Item } from "./HeaderButtons";
import EditableHeader from "./EditableHeader";
import "moment/locale/sk";
import FABToggle from "../actions/FABActions";
import { HeaderBackButton } from 'react-navigation';
const convert = require("color-convert");
const uuidv4 = require("uuid/v4");

class CreateNote extends Component {
  
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params.titleText ? `${params.titleText}` : undefined,
      headerStyle: {
        backgroundColor: params && params.color ? `${params.color}` : "#1a72b4"
      },
      headerTintColor: "white",
      headerTitleStyle:  {color: "white"},
      headerLeft:
        params && params.edit ? (
          <EditableHeader
            color={params.color}
            titleText={params.titleText}
            setHeader={() => params.setHeader()}
          />
        ) : (
          <HeaderBackButton tintColor="white" onPress={()=>{params.handleCache(); navigation.goBack()}}/>
        ),
      headerRight: (
        <MaterialHeaderButtons>
          {params && params.edit === false ? (
            <Item
              title="edit"
              iconName="edit"
              onPress={() => params.editHeader()}
            />
          ) : (
            undefined
          )}
          <Item title="Uložiť" iconName="" onPress={() => params.saveNote()} disabled={params && params.redirect ? true : false}/>
        </MaterialHeaderButtons>
      )
    };
  };
  constructor(props) {
    super(props);
    this.handleSaveNote = this.handleSaveNote.bind(this);
    this.datePicker = this.datePicker.bind(this);
    this._handleDatePicked = this._handleDatePicked.bind(this);
    this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
    this.editHeader = this.editHeader.bind(this);
    this.handleSetHeader = this.handleSetHeader.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this)
    this.handleCache = this.handleCache.bind(this)
    
    this.state = {
      text: this.props.cache.text,
      date: this.props.cache.note_date,
      snackBarVisible: false,
      remind: this.props.cache.note_remind,
      reminderDate: this.props.cache.note_reminderDate,
      editHeader: false,
      color: this.props.cache.note_color,
      error: false,
    };
  }
  componentWillMount() {
    this.props.navigation.setParams({
      editHeader: this.editHeader,
      setHeader: this.handleSetHeader,
      saveNote: this.handleSaveNote,
      handleCache: this.handleCache,
      redirect: false,
    });
    this.setState({
      key: uuidv4()
    });
  }
  handleHideMenu(){
    this.props.FABToggle()
  }
  editHeader() {
    let edit = this.props.navigation.state.params.edit;

    this.props.navigation.setParams({ edit: !edit });
  }
  componentDidUpdate(prevProps) {
    console.log(prevProps.title, this.props.title);
    if (prevProps.title !== this.props.title) {
      this.props.navigation.setParams({ titleText: this.props.title });
    }
  }
  handleCache(){
    let payload = {
      text: this.state.text,
      remind: this.state.remind,
      date: this.state.date,
      color: this.state.color,
      reminderDate: this.state.reminderDate
    }
    
    this.props.cacheText(payload)
  }

  handleSetHeader() {
    this.props.navigation.setParams({ edit: false });
  }
  handleSaveNote() {
    if (this.state.text !== ""){
    if (this.state.remind === true) {
      console.log("scheduling notification");
      //TODO DESIGN NOTIF
      const localNotification = {
        title: this.props.title,
        body: `Reminder for your note - ${moment(this.state.date).format(
          "DD/MM/YYYY, HH/mm"
        )}`, // (string) — body text of the notification.
        data: {
          key: this.state.key,
          color: this.state.color,
          title: this.props.title
        },
        // (optional) (object) — notification configuration specific to Android.
        android: {
          channelId: "reminders",
          sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
          icon:
            "https://cdn1.iconfinder.com/data/icons/hawcons/32/699318-icon-47-note-important-512.png", // URL of icon to display in notification drawer.
          color: this.state.color, // (optional) (string) — color of the notification icon in notification drawer.
          priority: "max", // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
          sticky: true, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
          vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
        }
      };

      const schedulingOptions = {
        time: Date.parse(this.state.reminderDate)
      };

      Notifications.scheduleLocalNotificationAsync(
        localNotification,
        schedulingOptions
      );
    }
    let payload = {
      key: this.state.key,
      date: Date.parse(this.state.date),
      title: this.props.title,
      text: this.state.text,
      remind: this.state.remind,
      reminderDate: this.state.reminderDate,
      color: this.state.color,
      star: false,
      archive: false
    };
    console.log(payload);
    this.setState({
      redirect: true,
      error: false
    });
    
    if (payload.title !== "" && payload.text !== "") {
      this.props.saveNote(payload);
      this.props.clearCacheNote()
      this.props.navigation.setParams({redirect: true})
    }
    }
    else{
      this.setState({
        error: true
      })
    }
  }


  _hideDateTimePicker = () =>
    this.setState({ openDateTime: false, remind: false });

  _handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    this._hideDateTimePicker();
    this.setState({
      snackBarVisible: true,
      reminderDate: date,
      remind: true
    });
  };
  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });

  async datePicker() {
    let timeString;
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.state.date,
        minDate: new Date()
      });

      if (action === DatePickerAndroid.dateSetAction) {
        let dateString = `${day}-${month + 1}-${year}`;
        let dateObj = moment(dateString, "DD-MM-YYYY").toDate();
        console.log(dateString);
        console.log("////");
        console.log(dateObj);
        this.setState({
          date: dateObj
        });
        try {
          const { action, hour, minute } = await TimePickerAndroid.open({
            is24Hour: true
          });
          if (action !== TimePickerAndroid.dismissedAction) {
            if (minute > 9) {
              timeString = `${hour}:${minute}`;
            } else {
              timeString = `${hour}:0${minute}`;
            }
            console.log(timeString);
            this.setState({
              date: moment(dateString + timeString, "DD-MM-YYYYHH:mm").toDate(),
              time: timeString
            });
          }
        } catch ({ code, message }) {
          console.warn("Cannot open time picker", message);
        }
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }
  
      

  render() {
       

    return (
      <View style={styles.viewStyle}>
        <View style={styles.dateStyle}>
          <View style={styles.dateEditStyle}>
            <List.Section
              style={styles.textStyle}
              title={`${moment(this.state.date).format("LL")} / ${
                this.state.time
                  ? this.state.time
                  : moment(this.props.cache.note_date).format("HH:mm")
              }`}
            />
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
              onPress={() =>
                this.setState({ remind: true, openDateTime: true })
              }
            />

            <Switch
              value={this.state.remind}
              color={this.state.color}
              onValueChange={() => {
                this.setState({
                  remind: !this.state.remind,
                  openDateTime: true
                });
              }}
            />
          </View>
        </View>

        <View style={styles.inputStyle}>
        <HelperText
          type="error"
          visible={this.state.error}
        >
          Prázdnu poznámku nemožno uložiť
        </HelperText>
          <TextInput
            theme={{ colors: { primary: this.state.color } }}
            label="Poznámka"
            value={this.state.text}
            onChangeText={text => this.setState({ text: text, error: text !== "" ? false : true })}
            mode="outlined"
            multiline={true}
            numberOfLines={12}
            blurOnSubmit={true}
          />
          
        </View>

        <View style={styles.AppBarStyle}>
          <AppBar
          handleHideMenu = {this.handleHideMenu}
          fab = {this.props.fab}
            openDatePicker={this.datePicker}
            handleSaveNote={this.handleSaveNote}
            color={this.state.color}
            openModal={this._showModal}
           
          />
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
          Pripomienka je nastavená na:{" "}
          {moment(this.state.reminderDate).format("DD/MM/YYYY HH:mm")}
        </Snackbar>
        <Snackbar
          visible={this.state.redirect}
          onDismiss={() => {
            this.setState({ redirect: false });
            
            this.props.navigation.navigate("Home");
            this.props.setTitle("Bez názvu");
          }}
          style={styles.snackbarStyle}
          duration={1000}
        >
          Uložené, vraciam Vás domov...
        </Snackbar>
        <Portal>
          <Modal
            style={{
              alignItems: "center",
              flex: 1,
              justifyContent: "center"
            }}
            visible={this.state.visible}
            onDismiss={this._hideModal}
          >
            <View style={{ height: Dimensions.get("window").height / 2 }}>
              <TriangleColorPicker
                style={{ flex: 1 }}
                oldColor={this.state.color}
                onColorSelected={color => {
                  console.log(color);
                  this.props.navigation.setParams({ color: color });
                  this.setState({
                    color: color
                  });
                  this._hideModal();
                }}
              />
            </View>
          </Modal>
        </Portal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1
  },
  viewButtonStyle: {
    borderRadius: 5
  },
  inputStyle: {
    margin: 10
  },
  titleStyle: {
    marginBottom: 20
  },
  buttonStyle: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderColor: "blue",
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  AppBarStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },

  dateStyle: {
    marginTop: 17.5,
    margin: 10,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: -5
  },
  iconStyle: {
    marginTop: 17,
    marginBottom: 10
  },
  remindIconStyle: {
    marginTop: 17,
    marginBottom: 10
  },
  dateEditStyle: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },

  remindStyle: {
    flexDirection: "row",
    justifyContent: "center"
  },
  snackbarStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 55,
    zIndex: 200,
    margin: 0,
    padding: 0,
    borderRadius: 0
  }
});
const mapStateToProps = state => ({
  title: state.title,
  fab: state.fab,
  cache: state.cache
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ saveNote: saveNote, FABToggle: FABToggle, cacheText: cacheText, clearCacheNote: clearCacheNote, setTitle: setTitle }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNote);
