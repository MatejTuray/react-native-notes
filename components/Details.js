// TODO CHECK LIST SAVE 

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  DatePickerAndroid,
  TimePickerAndroid,
  Vibration,
  Share,
  NetInfo,
  Alert,
  Keyboard,
  Dimensions
 
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DetailsAppBar from "./DetailsAppBar";
import * as Animatable from "react-native-animatable";
import { TextInput } from "react-native-paper";
import {
  List,
  Checkbox,
  IconButton,
  Divider,
  ProgressBar,
  Snackbar,
  Chip,
  Portal,
  Modal,
} from "react-native-paper";
import Swipeout from "react-native-swipeout";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { updateNote, changeColor } from "../actions/notesActions";
import { MaterialHeaderButtons, Item } from "./HeaderButtons";
import { Linking } from "expo";
import axios from "axios";
const uuidv4 = require("uuid").v4
import { TriangleColorPicker } from "react-native-color-picker";
import FABToggle from "../actions/FABActions";

class Details extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params.title
        ? `${params.title && params.len ? params.len : params.title}`
        : "Podrobnosti",
      headerStyle: {
        backgroundColor:
          params && params.len > 0 && params.color ? `gray` : `${params.color}`
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      },
      headerRight: (
        <MaterialHeaderButtons>
          <Item
            title="UPDATE"
            iconSize={30}
            iconName={params.adding ? "done" : "playlist-add"}
            onPress={() => params.toggleAdd()}
          />
        </MaterialHeaderButtons>
      )
    };
  };
  constructor(props) {
    super(props);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    
    this.state = {
      text: "",
      list: [],
      selected: [],
      visible: false,
      loading: false,
      adding: false,
      priceAmount: false,
      hide: false,
      totalPrice: 0
    };
  }
  componentWillMount() {
    this.props.navigation.setParams({
      handleUpdate: this.handleUpdate,
      toggleAdd: this.toggleAdd,
      adding: false
    });
  }
  componentDidMount() {
    
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  
    this.setState({
      text: this.props.note.text,
      list: this.props.note.list,
      totalPrice: this.props.totalPrice
    });
    NetInfo.getConnectionInfo().then(connectionInfo => {
       this.setState({
        connection: connectionInfo.type
      });
    });
    function handleFirstConnectivityChange(connectionInfo) {
      
      this.setState({
        connection: connectionInfo.type
      });
      NetInfo.removeEventListener(
        "connectionChange",
        handleFirstConnectivityChange
      );
    }
    NetInfo.addEventListener("connectionChange", handleFirstConnectivityChange);
  }
  toggleAdd() {
    this.props.navigation.setParams({ adding: !this.state.adding });
    this.setState({
      adding: !this.state.adding
    });
  }
  handleHideMenu(){
    this.props.FABToggle()
  }
  handleCheck(item) {
    this.setState(prevState => ({
      list: prevState.list.map(obj =>
        obj.key === item.key ? Object.assign(obj, { status: !obj.status }) : obj
      )
    }));
    
  }
 
  handleDelete() {
    for (let elem of this.state.selected) {
      this.setState({
        list: this.state.list.filter(item => elem.key != item.key)
      });
    }
  }

  handleSelect(item) {
    if (this.state.selected.includes(item)) {
      this.setState({
        selected: this.state.selected.filter(obj => obj.key !== item.key)
      });
    } else {
      this.setState({
        selected: this.state.selected.concat(item),
        change: true
      });
    }
    Vibration.vibrate(50);
  }
  _keyboardDidShow () {
    this.setState({
      keyboard: true
    });
  }

  _keyboardDidHide () {
    this.setState({
      keyboard: false
    })
  }

  async handleShare() {
    // TODO LINKS WORK BASIC
    try {
      if (
        this.state.connection !== "none" &&
        this.state.connection !== "unknown"
      ) {
        let link = Linking.makeUrl("", { key: this.props.note.key });

        let httpsLink = `https://react-native-notesapi.herokuapp.com/?key=${
          this.props.note.key
        }`;
        this.setState({
          loading: true
        });
        if (this.props.note.text && this.props.note.text !== "") {
          axios
            .post("https://react-native-notesapi.herokuapp.com/api/note", {
              key: this.props.note.key,
              title: this.props.note.title,
              text: this.state.text,
              date: this.props.note.date,
              remind: this.props.note.remind,
              reminderDate: this.props.note.reminderDate,
              color: this.props.note.color
            })
            .then(res => {
              
              this.setState({
                loading: false
              });
            })
            .catch(e => console.log(e));
          if (this.state.loading === false) {
            let result = await Share.share({
              title: this.props.note.title,
              message: httpsLink
            });
          }
        } else {
          axios
            .post("https://react-native-notesapi.herokuapp.com/api/list", {
              key: this.props.note.key,
              title: this.props.note.title,
              list: this.state.list,
              date: this.props.note.date,
              remind: this.props.note.remind,
              reminderDate: this.props.note.reminderDate,
              color: this.props.note.color,
              totalPrice: this.state.totalPrice
            })
            .then(res => {
              
              this.setState({
                loading: false
              });
            })
            .catch(e => console.log(e));
          if (this.state.loading === false) {
            let result = await Share.share({
              title: this.props.note.title,
              message: httpsLink
            });
          }
        }
      }
      else{
        Alert.alert("Zdieľanie zlyhalo", "Skontrolujte prosím pripojenie k internetu")
      }
    
      
    } catch (error) {
      alert(error.message);
    }
  }

  handleEdit(item) {
    this.setState(prevState => ({
      list: prevState.list.map(obj =>
        obj.key === item.key ? Object.assign(obj, { editing: true }) : obj
      )
    }));
    
  }
  handleUpdate() {
    if (this.state.list && this.state.list.length > 1) {      
      let payload = this.props.note
      payload.list = this.state.list     
      console.log(payload.title)
      this.props.updateNote(payload, this.props.note.key);
      
    } else {
      this.props.updateNote({ text: this.state.text }, this.props.note.key);
    }
   
  }
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
        this.setState({
          date: dateObj
        });
        try {
          const { action, hour, minute } = await TimePickerAndroid.open({
            is24Hour: true
          });
          if (action !== TimePickerAndroid.dismissedAction) {
            if (minute > 10) {
              timeString = `${hour}:${minute}`;
            } else {
              timeString = `${hour}:0${minute}`;
            }
             this.setState({
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
  componentWillUnmount () {
    
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    console.log("unmounting")
    if (this.state.list && this.state.list.length >= 2){
    this.handleUpdate()
    }
    else{
      console.log("error?")
    }
    
    
    
  }
  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });

  render() {
    let swipeoutBtnsRight = [
      {
        component: (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <IconButton icon="delete" color="white" />
          </View>
        ),
        onPress: () => {
          
          this.setState({
            list: this.state.list.filter(
              item => item.key !== this.state.currItem.key
            )
          });
  
        },
        type: "delete"
      }
    ];
    return (
      <View style={styles.viewStyle}>
      
      {this.state.adding ? <View style={styles.inputStyle}>
      <TextInput
        theme={{ colors: { primary: this.props.note.color } }}
        label="Položka"
        value={this.state.text}
        style={{ backgroundColor: "transparent" }}                    
        onChangeText={text => {
          this.setState({ text });
          this.setState({
            expanded: true
          });
        }}
        editable={!this.state.priceAmount}
        onSubmitEditing={() => {          
          
          this.setState({              
            priceAmount: true,
          });
        }}
        mode="flat"
      />
      <Divider/>
     </View> 
    : 
     undefined}      
        {this.state.priceAmount && this.state.adding ?  <View style={this.state.keyboard ? styles.rowStyle : {flex: 0.1, marginBottom: 55, flexDirection: "row"}}>
        <View style={{ flex: 1 }}>
        <TextInput
          theme={{ colors: { primary: this.props.note.color } }}
          label="Množstvo"
          value={this.state.textAmount}
          style={{ backgroundColor: "transparent", marginRight: 5 }}                    
          onChangeText={textAmount => {
            this.setState({ textAmount });      
          }}         
         
          mode="flat"
          keyboardType="phone-pad"
        />
        </View>
        <View style={{flex: 1}}>
        <TextInput
        theme={{ colors: { primary: this.props.note.color } }}
          label="Cena"
          value={this.state.textPrice}
          style={{ backgroundColor: "transparent", marginLeft: 5 }}                    
          onChangeText={textPrice => {
            this.setState({ textPrice });             
          }}
          onSubmitEditing={() => {                    
              this.setState({
                text: "",
                textPrice: "",
                textAmount: "",
                priceAmount: false,
                adding: false,
                prevLen: this.state.list.length,
                list: this.state.list.concat({
                  text: this.state.text,
                  status: false,
                  editing: false,
                  editValue: false,
                  value: parseInt(this.state.textAmount),
                  price: parseInt(this.state.textPrice),
                  selected: false,
                  key: uuidv4()
                }),
               
              });     
                         
            this.props.navigation.setParams({adding: false})
           
          
            
          }}
          mode="flat"
          keyboardType="phone-pad"/>
          </View>
        <Divider/>
       </View>: 
       undefined } 
        {this.props.note.text ? (
          <TextInput
            theme={{ colors: { primary: this.props.note.color } }}
            style={styles.textStyle}
            label="Poznámka"
            value={this.state.text}
            onChangeText={text => this.setState({ text: text })}
            mode="outlined"
            multiline={true}
            numberOfLines={12}
          />
        ) : <ScrollView style={ styles.scrollStyle}>
            <FlatList
              data= {this.state.list}
              renderItem={({ item, index }) => (
                <Swipeout onOpen={() => this.setState({currItem: item})} left={swipeoutBtnsRight} buttonWidth={80} sensitivity={1}>
                  {item.editing ? (
                    <View style={styles.inputStyle}>
                      <TextInput
                        theme={{ colors: { primary: this.props.note.color } }}
                        style={styles.inputStyle}
                        onBlur={() =>
                          this.setState(prevState => ({
                            list: prevState.list.map(obj =>
                              obj.key === item.key
                                ? Object.assign(obj, { editing: false })
                                : obj
                            )
                          }))
                        }
                        value={item.text}
                        onChangeText={itemText =>
                          this.setState(prevState => ({
                            list: prevState.list.map(obj =>
                              obj.key === item.key
                                ? Object.assign(obj, { text: itemText })
                                : obj
                            )
                          }))
                        }
                        onSubmitEditing={itemText => {
                     
                          this.setState(prevState => ({
                            list: prevState.list.map(obj =>
                              obj.key === item.key
                                ? Object.assign(obj, {
                                    text: item.text,
                                    editing: false
                                  })
                                : obj
                            )
                          }));
                        }}
                      />
                    </View>
                  ) : (
                    <List.Item
                      key={item.key}
                      title={
                        item.price != 0
                          ? `${item.text}:  ${item.value}ks - ${item.price *
                              item.value}€ spolu`
                          : `${item.text}: ${item.value}ks`
                      }
                      style={
                        this.state.selected.includes(item)
                          ? { backgroundColor: "#b2b2b2" }
                          : { backgroundColor: "white" }
                      }
                      onPress={() => {
                        this.handleCheck(item);
                      }}
                      left={props => (
                        <View style={styles.checkboxStyle}>
                          <Checkbox.Android
                            {...props}
                            status={item.status ? "checked" : "unchecked"}
                            color={this.props.note.color}
                          />
                        </View>
                      )}
                      right={props => (
                        <View {...props}>
                          <IconButton
                            style={{ marginRight: 5 }}
                            onPress={() => this.handleEdit(item)}
                            {...props}
                            icon="edit"
                          />
                        </View>
                      )}
                    />
                  )}

                  <Divider />
                </Swipeout>
              )}
            />
          </ScrollView>}          
       
        
        <View style={styles.AppBarStyle}>
          <Animatable.View animation="bounceInLeft">
            <DetailsAppBar
              openModal={this._showModal}
              totalPrice={this.state.totalPrice}
              handleShare={this.handleShare}
              handleHideMenu = {this.handleHideMenu}
              fab = {this.props.fab}
              color={
                this.state.selected.length > 0 ? "gray" : this.props.note.color
              }
              openDatePicker={this.datePicker}
              handleUpdate={() => this.handleUpdate()}
            />
          </Animatable.View>
        </View>    
        {this.state.list && this.state.list.length > 0 && this.state.adding === false && this.state.priceAmount === false?         
      <View style={styles.progressStyle}>      
      <ProgressBar
       progress={
         this.state.list
           ? this.state.list.filter(item => item.status === true)
               .length / this.state.list.length
           : undefined
       }
       color={this.props.note.color}
       style={styles.ProgressBarStyle}
     /></View> : undefined}
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
           oldColor={this.props.note.color}
           onColorSelected={color => {
             console.log(color);
             this.props.navigation.setParams({ color: color });
             this.props.changeColor(color)
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
  rowStyle:{
    flex: 0.1,
    flexDirection: "row",
    margin: 5,
    marginBottom: 55,
   
  },
  viewStyle: {
    flex: 1
  },
  viewButtonStyle: {
    borderRadius: 5
  },
  ProgressBarStyle: {
    margin: 20
  },
  inputStyle: {
    margin: 0,
    backgroundColor: "white"
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
    alignItems: "center"
  },
  AppBarStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "gray"
  },
  dateStyle: {
    marginTop: 17.5,
    margin: 10,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textStyle: {
    margin: 10
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
  },
  progressStyle: {  
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 55,
    zIndex: 200,
    margin: 0,
    padding: 0,
    borderRadius: 0
  },
  scrollStyle: {
    flex: 1,
    lineHeight: 1, 
    height: 300,  
    marginBottom: 55     
  },
  listItemStyle: {
    backgroundColor: "white"
  },
  checkboxStyle: {
    marginTop: 5
  }
});

const mapStateToProps = state => {
  return {
    note: state.selectedNote,
    notes: state.notes,
    fab: state.fab
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ updateNote: updateNote, FABToggle: FABToggle, changeColor: changeColor }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Details);
