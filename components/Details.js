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
  Alert
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
  Chip
} from "react-native-paper";
import Swipeout from "react-native-swipeout";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { updateNote } from "../actions/notesActions";
import { MaterialHeaderButtons, Item } from "./HeaderButtons";
import { Linking } from "expo";
import axios from "axios";

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
      }
      // headerRight: (
      //   <MaterialHeaderButtons>
      //     <Item
      //       title="UPDATE"
      //       iconName="update"
      //       onPress={() => params.handleUpdate()}
      //     />
      //   </MaterialHeaderButtons>
      // )
    };
  };
  constructor(props) {
    super(props);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      text: "",
      list: [],
      selected: [],
      visible: false,
      loading: false
    };
  }
  componentWillMount() {
    this.props.navigation.setParams({
      handleUpdate: this.handleUpdate
    });
  }
  componentDidMount() {
    console.log(this.props.note);
    this.setState({
      text: this.props.note.text,
      list: this.props.note.list
    });
    NetInfo.getConnectionInfo().then(connectionInfo => {
      console.log(
        "Initial, type: " +
          connectionInfo.type +
          ", effectiveType: " +
          connectionInfo.effectiveType
      );
      this.setState({
        connection: connectionInfo.type
      });
    });
    function handleFirstConnectivityChange(connectionInfo) {
      console.log(
        "First change, type: " +
          connectionInfo.type +
          ", effectiveType: " +
          connectionInfo.effectiveType
      );
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
              text: this.props.note.text,
              date: this.props.note.date,
              remind: this.props.note.remind,
              reminderDate: this.props.note.reminderDate,
              color: this.props.note.color
            })
            .then(res => {
              console.log(res);
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
              list: this.props.note.list,
              date: this.props.note.date,
              remind: this.props.note.remind,
              reminderDate: this.props.note.reminderDate,
              color: this.props.note.color,
              totalPrice: this.props.note.totalPrice
            })
            .then(res => {
              console.log(res);
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
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("shared with", result.activityType);
        } else {
          console.log("shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
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
    if (this.state.text === "") {
      this.props.updateNote(this.state.list, this.props.note.key);
    } else {
      this.props.updateNote({ text: this.state.text }, this.props.note.key);
    }
    this.setState({
      redirect: true
    });
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
        console.log(dateString);
        console.log(dateObj);
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
            console.log(timeString);
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

  render() {
    return (
      <View style={styles.viewStyle}>
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
        ) : (
          <ScrollView style={styles.scrollStyle}>
            <FlatList
              data={this.state.list}
              renderItem={({ item, index }) => (
                <Swipeout>
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
                          console.log(this.state.newText);
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
                      title={`${item.text}:  ${item.value}ks - ${item.price *
                        item.value}€ spolu`}
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
          </ScrollView>
        )}
        <View style={styles.snackbarStyle}>
          {this.state.list &&
          !this.state.redirect &&
          this.props.note.text === "" ? (
            <ProgressBar
              progress={
                this.state.list
                  ? this.state.list.filter(item => item.status === true)
                      .length / this.state.list.length
                  : undefined
              }
              color={this.props.note.color}
              style={styles.ProgressBarStyle}
            />
          ) : (
            undefined
          )}
        </View>
        <View style={styles.AppBarStyle}>
          <Animatable.View animation="bounceInLeft">
            <DetailsAppBar
              totalPrice={this.props.note.totalPrice}
              handleShare={this.handleShare}
              color={
                this.state.selected.length > 0 ? "gray" : this.props.note.color
              }
              openDatePicker={this.datePicker}
              handleUpdate={() => this.handleUpdate()}
            />
          </Animatable.View>
        </View>
        <Snackbar
          visible={this.state.redirect}
          onDismiss={() => {
            this.setState({ redirect: false });
          }}
          style={styles.snackbarStyle}
          duration={3000}
        >
          Aktualizované
        </Snackbar>
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
  scrollStyle: {
    lineHeight: 1,
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
    notes: state.notes
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ updateNote: updateNote }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Details);
