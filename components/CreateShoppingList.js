import React, { Component } from "react";
import {
  View,
  StyleSheet,
  DatePickerAndroid,
  ScrollView,
  TimePickerAndroid,
  Dimensions,
  FlatList,
  Vibration
} from "react-native";
import { TextInput, TouchableRipple } from "react-native-paper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  saveNote,
  cacheList,
  clearCacheList,
  setTitle
} from "../actions/notesActions";
import moment from "moment";
import AppBar from "./AppBar";
import {
  List,
  Checkbox,
  IconButton,
  Switch,
  Snackbar,
  Modal,
  Portal,
  Chip,
  Divider,
  Text,
  HelperText
} from "react-native-paper";
import DateTimePicker from "react-native-modal-datetime-picker";
import { TriangleColorPicker } from "react-native-color-picker";
import { Notifications } from "expo";
import { MaterialHeaderButtons, Item } from "./HeaderButtons";
import EditableHeader from "./EditableHeader";
const uuidv4 = require("uuid/v4");
import Swipeout from "react-native-swipeout";
import "moment/locale/sk";
import FABToggle from "../actions/FABActions";
import { HeaderBackButton } from "react-navigation";
import { copilot, CopilotStep } from "@okgrow/react-native-copilot";
class CreateShoppingList extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    console.log(params);

    return {
      title: params.titleText ? `${params.titleText}` : undefined,
      headerStyle: {
        backgroundColor:
          params && params.color ? `${params.color}` : params.primary
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      },
      headerLeft:
        params && params.edit ? (
          <EditableHeader
            color={params.color}
            titleText={params.titleText}
            setHeader={() => params.setHeader()}
          />
        ) : (
          <HeaderBackButton
            tintColor="white"
            onPress={() => {
              params.handleCache();
              navigation.goBack();
            }}
          />
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
          <Item
            title="Pomoc"
            iconName="help-outline"
            onPress={() => params.help()}
          />
          <Item
            title="uložiť"
            iconName=""
            onPress={() => params.saveNote()}
            disabled={params && params.redirect ? true : false}
          />
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
    this.handleCheck = this.handleCheck.bind(this);
    this.handleListItem = this.handleListItem.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleCache = this.handleCache.bind(this);
    this.help = this.help.bind(this);
    this.state = {
      text: this.props.cache.list_itemText,
      date: this.props.cache.list_date,
      title: "",
      list: this.props.cache.list,
      snackBarVisible: false,
      remind: this.props.cache.list_remind,
      reminderDate: this.props.cache.list_reminderDate,
      color: this.props.cache.list_color,
      editHeader: false,
      setPrice: false,
      selectedItem: {},
      editPrice: false,
      selected: [],
      error: false,
      renderBack: true,
      errorEmpty: false
    };
  }
  componentWillMount() {
    console.log(this.props.cache.list_date);
    this.props.navigation.setParams({
      editHeader: this.editHeader,
      setHeader: this.handleSetHeader,
      saveNote: this.handleSaveNote,
      handleCache: this.handleCache,
      redirect: false,
      help: this.help,
      primary: this.props.theme.primary,
      secondary: this.props.theme.secondary
    });
    this.setState({
      key: uuidv4()
    });
  }
  editHeader() {
    let edit = this.props.navigation.state.params.edit;

    this.props.navigation.setParams({ edit: !edit });
  }
  componentDidMount() {
    this.props.copilotEvents.on("stop", () => {
      this.setState({
        renderBack: true
      });
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.props.navigation.setParams({ titleText: this.props.title });
      this.props.navigation.setParams({ titleText: this.props.title });
    }
  }
  componentWillUnmount() {
    this.props.copilotEvents.off("stop");
  }

  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });

  handleSetHeader() {
    this.props.navigation.setParams({ edit: false });
  }
  handleCache() {
    console.log(this.state.date);
    let payload = {
      list: this.state.list,
      remind: this.state.remind,
      date: this.state.date,
      color: this.state.color,
      reminderDate: this.state.reminderDate,
      listItemText: this.state.text
    };
    this.props.cacheList(payload);
  }

  handleSaveNote() {
    if (this.state.list.length !== 0) {
      if (this.state.remind === true) {
        console.log("scheduling notification");
        //TODO DESIGN NOTIF
        const localNotification = {
          title: this.props.title,
          body: `Pripomienka Vášho zoznamu - ${moment(this.state.date).format(
            "DD/MM/YYYY, HH:mm"
          )}`, // (string) — body text of the notification.
          data: {
            key: this.state.key,
            color: this.state.color,
            title: this.props.title
          },
          // (optional) (object) — notification configuration specific to Android.
          android: {
            sound: true,
            channelId: "reminders", // (optional) (boolean) — if true, play a sound. Default: false.
            //icon (optional) (string) — URL of icon to display in notification drawer.
            //color (optional) (string) — color of the notification icon in notification drawer.
            priority: "max", // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
            sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
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
        list: this.state.list,
        remind: this.state.remind,
        reminderDate: this.state.reminderDate,
        color: this.state.color,
        star: false,
        archive: false,
        totalPrice: this.state.list
          .map(item => item.price * item.value)
          .reduce((p, c) => p + c)
      };

      console.log(payload);
      this.setState({
        redirect: true,
        error: false
      });
      this.props.saveNote(payload);
      this.props.clearCacheList(this.props.theme.primary);
      this.props.navigation.setParams({ redirect: true });
    } else {
      this.setState({
        error: true
      });
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
  showPriceModal(item) {
    console.log(item);
    this.setState({
      setPrice: true
    });
  }
  handleDelete() {
    for (let elem of this.state.list) {
      if (elem.selected === true) {
        this.setState({
          list: this.state.list.filter(item => item.key !== elem.key)
        });
      }
    }
  }
  handleCheck(item, value) {
    this.setState(prevState => ({
      list: prevState.list.map(obj =>
        obj.key === item.key ? Object.assign(obj, { value: value }) : obj
      )
    }));
  }
  handleListItem(item) {
    this.setState({
      selectedItem: item
    });
  }
  handleHideMenu() {
    this.props.FABToggle();
  }
  async datePicker() {
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
            is24Hour: true // Will display '2 PM'
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
  help() {
    this.setState({
      renderBack: false
    });
    this.props.start();
  }
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
              item => item.key !== this.state.selectedItem.key
            )
          });
        },
        type: "delete"
      }
    ];
    const CopilotDate = ({ copilot }) => {
      return (
        <View {...copilot} style={styles.dateEditStyle}>
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
      );
    };
    const CopilotReminder = ({ copilot }) => {
      return (
        <View {...copilot} style={styles.remindStyle}>
          <IconButton
            style={styles.remindIconStyle}
            color={this.state.remind ? "green" : "black"}
            icon="notifications"
            size={20}
            onPress={() => this.setState({ remind: true, openDateTime: true })}
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
      );
    };
    const CopilotAppBar = ({ copilot }) => {
      return (
        <View {...copilot} style={styles.AppBarStyle}>
          <AppBar
            handleHideMenu={this.handleHideMenu}
            fab={this.props.fab}
            color={this.state.color}
            openDatePicker={this.datePicker}
            handleSaveNote={this.handleSaveNote}
            openModal={this._showModal}
            handleDelete={this.handleDelete}
            totalPrice={
              this.state.list !== []
                ? this.state.list.map(item => item.value * item.price)
                : 0
            }
          />
        </View>
      );
    };
    const CopilotInput = ({ copilot }) => {
      return (
        <View {...copilot} style={styles.inputStyle}>
          <TextInput
            theme={{ colors: { primary: this.state.color } }}
            label="Položka"
            value={this.state.text}
            style={{ backgroundColor: "transparent" }}
            onChangeText={text => {
              this.setState({ text });
              this.setState({
                expanded: true
              });
            }}
            onSubmitEditing={() => {
              if (this.state.text !== "") {
                this.setState({
                  error: false,
                  list: this.state.list.concat({
                    text: this.state.text,
                    status: false,
                    editing: false,
                    editValue: false,
                    value: 1,
                    price: 0,
                    selected: false,
                    key: uuidv4()
                  })
                });
                console.log(this.state.list);
                this.setState({
                  text: ""
                });
              } else {
                this.setState({
                  errorEmpty: true
                });
              }
            }}
            mode="flat"
          />
          <HelperText type="error" visible={this.state.error}>
            Pridajte prosím aspoň jednu položku do zoznamu
          </HelperText>
          <HelperText type="error" visible={this.state.errorEmpty}>
            Nemožno pridať položku bez názvu
          </HelperText>
        </View>
      );
    };
    return (
      <View style={styles.viewStyle}>
        <View style={styles.dateStyle}>
          <CopilotStep
            text="Tu si môžete nastaviť dátum poznámky"
            order={1}
            name="date"
          >
            <CopilotDate />
          </CopilotStep>
          <CopilotStep
            text="Nastavte pripomienku a dátum pripomienky"
            order={2}
            name="remind"
          >
            <CopilotReminder />
          </CopilotStep>
        </View>
        {!this.state.renderBack ? (
          <CopilotStep
            text="Sem môžete napísať názov položky, po pridaní do zoznamu možno nastaviť cenu a počet kusov"
            order={3}
            name="input"
          >
            <CopilotInput />
          </CopilotStep>
        ) : (
          <View style={styles.inputStyle}>
            <TextInput
              theme={{ colors: { primary: this.state.color } }}
              label="Položka"
              value={this.state.text}
              style={{ backgroundColor: "transparent" }}
              onChangeText={text => {
                this.setState({ text });
                this.setState({
                  expanded: true
                });
              }}
              onSubmitEditing={() => {
                if (this.state.text !== "") {
                  this.setState({
                    error: false,
                    errorEmpty: false,
                    list: this.state.list.concat({
                      text: this.state.text,
                      status: false,
                      editing: false,
                      editValue: false,
                      value: 1,
                      price: 0,
                      selected: false,
                      key: uuidv4()
                    })
                  });
                  console.log(this.state.list);
                  this.setState({
                    text: ""
                  });
                } else {
                  this.setState({
                    errorEmpty: true
                  });
                }
              }}
              mode="flat"
            />
            <HelperText type="error" visible={this.state.error}>
              Pridajte prosím aspoň jednu položku do zoznamu
            </HelperText>
            <HelperText type="error" visible={this.state.errorEmpty}>
              Nemožno pridať položku bez názvu
            </HelperText>
          </View>
        )}
        <ScrollView style={styles.scrollStyle}>
          <FlatList
            data={this.state.list}
            renderItem={({ item }) => (
              <Swipeout
                autoClose={true}
                right={swipeoutBtnsRight}
                onOpen={() => this.handleListItem(item)}
              >
                {item.editing ? (
                  <View style={{ flex: 1, flexDirection: "column-reverse" }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <IconButton
                        icon="euro-symbol"
                        onPress={() =>
                          this.setState(prevState => ({
                            list: prevState.list.map(obj =>
                              obj.key === item.key
                                ? Object.assign(obj, { editing: false })
                                : obj
                            )
                          }))
                        }
                      />
                      <TextInput
                        theme={{ colors: { primary: this.state.color } }}
                        style={{ flex: 1, backgroundColor: "white" }}
                        value={item.price.toString()}
                        label={`Nastaviť cenu pre ${item.text}`}
                        mode="flat"
                        keyboardType="phone-pad"
                        onChangeText={itemText =>
                          this.setState(prevState => ({
                            list: prevState.list.map(obj =>
                              obj.key === item.key
                                ? Object.assign(obj, { price: itemText })
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
                                    price:
                                      Math.round(
                                        parseFloat(
                                          (
                                            item.price * Math.pow(10, 2)
                                          ).toFixed(2)
                                        )
                                      ) / Math.pow(10, 2),
                                    editing: false
                                  })
                                : obj
                            )
                          }));
                        }}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <IconButton
                        icon="label"
                        onPress={() =>
                          this.setState(prevState => ({
                            list: prevState.list.map(obj =>
                              obj.key === item.key
                                ? Object.assign(obj, { editing: false })
                                : obj
                            )
                          }))
                        }
                      />
                      <TextInput
                        theme={{ colors: { primary: this.state.color } }}
                        style={{ flex: 1, backgroundColor: "white" }}
                        value={item.text}
                        mode="flat"
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
                  </View>
                ) : (
                  <List.Item
                    key={item.key}
                    title={item.text}
                    onPress={() => console.log(item.key, item.text, " pressed")}
                    style={
                      item.selected
                        ? { backgroundColor: "#b2b2b2" }
                        : { backgroundColor: "white" }
                    }
                    onLongPress={() => {
                      this.setState(prevState => ({
                        list: prevState.list.map(obj =>
                          obj.key === item.key
                            ? Object.assign(obj, { selected: !item.selected })
                            : obj
                        )
                      }));
                      Vibration.vibrate(50);
                    }}
                    right={props => (
                      <View
                        {...props}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Chip>
                            {Math.round(
                              parseFloat(
                                item.price * item.value * Math.pow(10, 2)
                              )
                            ).toFixed(2) / Math.pow(10, 2)}{" "}
                            €
                          </Chip>
                        </View>
                        <View {...props} style={{ flexDirection: "row" }}>
                          <IconButton
                            {...props}
                            icon="edit"
                            onPress={() => {
                              this.setState(prevState => ({
                                list: prevState.list.map(obj =>
                                  obj.key === item.key
                                    ? Object.assign(obj, { editing: true })
                                    : obj
                                )
                              }));
                              console.log("editing?");
                            }}
                          />

                          <IconButton
                            {...props}
                            icon="add"
                            onPress={() => {
                              this.setState(prevState => ({
                                list: prevState.list.map(obj =>
                                  obj.key === item.key
                                    ? Object.assign(obj, {
                                        value: obj.value + 1
                                      })
                                    : obj
                                )
                              }));
                              console.log("editing?");
                            }}
                          />
                          <IconButton
                            {...props}
                            icon="remove"
                            onPress={() => {
                              this.setState(prevState => ({
                                list: prevState.list.map(obj =>
                                  obj.key === item.key
                                    ? Object.assign(obj, {
                                        value:
                                          obj.value !== 1 ? obj.value - 1 : 1
                                      })
                                    : obj
                                )
                              }));
                              console.log("editing?");
                            }}
                          />
                        </View>
                      </View>
                    )}
                    left={props => (
                      <View
                        {...props}
                        style={{
                          marginRight: 10,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Chip>{item.value} ks</Chip>
                      </View>
                    )}
                  />
                )}
                <Divider />
              </Swipeout>
            )}
          />
        </ScrollView>
        <CopilotStep
          text="Tu môžete zvoliť zafarbenie poznámky, dátum a vypnúť resp. zapnúť menu, dlhým stlačením položky v zozname a stlačením ikony koša ju odstránite zo zoznamu"
          order={4}
          name="appbar"
        >
          <CopilotAppBar />
        </CopilotStep>

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
  inputStyle: {
    marginHorizontal: 10
  },
  scrollStyle: {
    lineHeight: 1,
    marginBottom: 55
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
    bottom: 0
  },
  amountStyle: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  listItemStyle: {
    padding: 5,
    backgroundColor: "white",
    margin: 5,
    paddingVertical: 20
  },
  swipeoutStyle: {
    backgroundColor: "white",
    margin: 5
  },
  dateStyle: {
    marginTop: 5,
    marginHorizontal: 10,
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textStyle: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: -5
  },
  iconStyle: {
    marginTop: 12,
    marginBottom: 5
  },
  remindIconStyle: {
    marginTop: 12,
    marginBottom: 5
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
  cache: state.cache,
  theme: state.theme
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      saveNote: saveNote,
      FABToggle: FABToggle,
      cacheList: cacheList,
      clearCacheList: clearCacheList,
      setTitle: setTitle
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  copilot({
    overlay: "svg", // or 'view'
    animated: true,
    verticalOffset: 100 // or false
  })(CreateShoppingList)
);
