import React, { Component } from "react";
import { StyleSheet, View, Vibration } from "react-native";
import { Text, IconButton } from "react-native-paper";
import moment from "moment";
import FabComponent from "./FabComponent";
import HomeAppBar from "./HomeAppBar";
import {
  DatePickerAndroid,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Button,
  NetInfo
} from "react-native";
import { Searchbar, List, Divider, Snackbar } from "react-native-paper";
import { connect } from "react-redux";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";
import {
  selectNote,
  deleteNote,
  toggleFavorites,
  setArchive,
  saveNote,
  setThemeCache
} from "../actions/notesActions";
import { bindActionCreators } from "redux";
import MaterialTabs from "react-native-material-tabs";
import { MaterialHeaderButtons, Item } from "./HeaderButtons";
import {
  getAll,
  getFavourite,
  setFilter,
  setQuery,
  handleDate
} from "../actions/filterActions";
import {
  rootSelector,
  getVisibleNotes,
  getVisibleNotesWithTextQuery,
  dateSelectWithQuery,
  getDateVisibleNotes
} from "../selectors/rootSelector";
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";
import { ActionCreators } from "redux-undo";
import { store } from "../configStore";
import { Notifications, Linking } from "expo";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import "moment/locale/sk";
import FABToggle from "../actions/FABActions";
const uuidv4 = require("uuid/v4");
import { copilot, CopilotStep } from "@okgrow/react-native-copilot";
class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title:
        params && params.len > 0
          ? `${params.len.toString()}`
          : params && params.date !== ""
          ? `${moment(params.date).format("LL")}`
          : "Domov",
      headerStyle: {
        backgroundColor: params && params.len > 0 ? "grey" : params.primary,
        elevation: 0
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      },
      headerRight: (
        <MaterialHeaderButtons key={uuidv4()}>
          {params && params.len < 1 && params.date && params.date !== "" ? (
            <Item
              key={uuidv4()}
              title="x"
              iconName="close"
              size={16}
              style={styles.headerButton}
              onPress={() => params.clearDate()}
            />
          ) : (
            undefined
          )}
          <Item
            key={uuidv4()}
            title="menu"
            iconName="menu"
            onPress={() => params.toggleMenu()}
          />
          <Item
            key={uuidv4()}
            title="date-range"
            iconName="date-range"
            onPress={() => params.datePicker()}
          />
          <Item
            title="Pomoc"
            iconName="help-outline"
            onPress={() => params.help()}
          />
        </MaterialHeaderButtons>
      )
    };
  };

  constructor(props) {
    super(props);
    this.datePicker = this.datePicker.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
    this.setTab = this.setTab.bind(this);
    this.onSwipe = this.onSwipe.bind(this);
    this.handleDataCheck = this.handleDataCheck.bind(this);
    this.clearDate = this.clearDate.bind(this);
    this.help = this.help.bind(this);
    this.state = {
      text: "",
      title: "",
      selected: [],
      change: false,
      selectedTab: 0,
      list: true,
      gestureName: "none",
      fetching: false,
      date: "",
      renderBack: true,
      test: true
    };
  }
  componentWillMount() {
    this.props.navigation.setParams({
      datePicker: this.datePicker,
      clearDate: this.clearDate,
      toggleMenu: this.props.FABToggle,
      help: this.help,
      primary: this.props.theme.primary,
      secondary: this.props.theme.secondary
    });
    this.props.setFilter(this.state.selectedTab);
    this.props.navigation.setParams({ len: 0 });
    this.props.setThemeCache(this.props.theme.primary);
  }
  componentWillUnmount() {
    this.props.copilotEvents.off("stop");
  }

  componentDidMount() {
    this.props.copilotEvents.on("stop", () => {
      this.setState({
        renderBack: true
      });
    });
    store.dispatch(ActionCreators.clearHistory());
    console.log(this.props);
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

    this.props.navigation.setParams({
      date: this.state.date
    });
    Notifications.addListener(notif => {
      console.log(notif.notificationId);
      if (notif.data.key && notif.data.title && notif.data.color) {
        let item = this.props.notes.present.find(
          item => item.key === notif.data.key
        );
        this.props.selectNote(item);
        this.props.navigation.navigate(`Details`, {
          id: item.key,
          title: item.title,
          color: item.color
        });
        Notifications.dismissNotificationAsync(notif.notificationId);
      }
    });

    Linking.addEventListener("url", url => {
      this._handleUrl(url);
    });
    Linking.getInitialURL()
      .then(res => (res !== null ? this._handleUrl(res) : console.log(res)))
      .catch(e => console.log(e));
  }
  clearDate() {
    this.props.handleDate(0);
    this.props.navigation.setParams({ date: "" });
    this.setState({
      date: ""
    });
  }
  help() {
    this.setState({
      renderBack: false
    });
    this.props.start();
  }
  _handleUrl = url => {
    this.setState({
      fetching: true
    });
    let parsed = url;
    let key;
    if (parsed) {
      console.log(parsed);
      try {
        key = parsed.match(/key=([^&]*)/)[1];
      } catch (e) {
        console.log(e);
      }
    }
    console.log(key);
    try {
      if (
        key !== undefined &&
        (this.state.connection !== "none" &&
          this.state.connection !== "unknown")
      ) {
        axios
          .get(`https://react-native-notesapi.herokuapp.com/api/items/${key}`)
          .then(res => {
            console.log(res.data);
            this.setState({
              itemData: res.data
            });
            if (
              this.props.notes.present.find(
                item => item.key === this.state.itemData.key
              ) ||
              this.props.reselect.find(
                item => item.key === this.state.itemData.key
              )
            ) {
              Alert.alert(
                "Tento záznam je už uložený",
                `${this.state.itemData.title} @ ${moment(
                  this.state.itemData.date
                ).format("DD/MM/YYYY HH:mm")}`
              );
              this.setState({
                fetching: false
              });
            } else {
              this.props.saveNote(this.state.itemData);
              Alert.alert(
                "Uložené",
                `${this.state.itemData.title} bola úspešne uložená`
              );
              if (this.state.itemData.remind === true) {
                console.log("scheduling notification");
                //TODO DESIGN NOTIF
                const localNotification = {
                  title: this.state.itemData.title,
                  body: `Reminder for your note - ${moment(
                    this.state.itemData.date
                  ).format("DD/MM/YYYY, HH/mm")}`, // (string) — body text of the notification.
                  data: {
                    key: this.state.itemData.key,
                    color: this.state.itemData.color,
                    title: this.state.itemData.title
                  },
                  // (optional) (object) — notification configuration specific to Android.
                  android: {
                    channelId: "reminders",
                    sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
                    icon:
                      "https://cdn1.iconfinder.com/data/icons/hawcons/32/699318-icon-47-note-important-512.png", // URL of icon to display in notification drawer.
                    color: this.state.itemData.color, // (optional) (string) — color of the notification icon in notification drawer.
                    priority: "max", // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
                    sticky: true, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
                    vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
                  }
                };

                const schedulingOptions = {
                  time: Date.parse(this.state.itemData.reminderDate)
                };

                Notifications.scheduleLocalNotificationAsync(
                  localNotification,
                  schedulingOptions
                );
              }
              this.setState({
                fetching: false
              });
            }
          })
          .catch(e =>
            Alert.alert(
              "Neplatný odkaz",
              "Tento odkaz už nie je platný, je nutné vygenerovať nový"
            )
          );
      }
    } catch (e) {
      console.log(e);
    }
  };

  setTab = selectedTab => {
    this.setState({ selectedTab });
    this.props.setFilter(selectedTab);
  };

  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    this.setState({ gestureName: gestureName });
    switch (gestureName) {
      case SWIPE_LEFT:
        console.log(this.state.gestureName);
        if (this.state.selectedTab !== 0) {
          let newState = this.state.selectedTab - 1;
          this.setState({
            selectedTab: newState
          });
          this.props.setFilter(newState);
        } else {
          let newState = 0;
          this.setState({
            selectedTab: newState
          });
          this.props.setFilter(newState);
        }
        break;

      case SWIPE_RIGHT:
        if (this.state.selectedTab <= 1) {
          let newState = this.state.selectedTab + 1;
          this.setState({
            selectedTab: newState
          });
          this.props.setFilter(newState);
        } else {
          let newState = 2;
          this.setState({
            selectedTab: newState
          });
          this.props.setFilter(newState);
        }
        break;
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
  handleDelete() {
    this.setState({
      undoable: this.state.selected
    });
    for (let elem of this.state.selected) {
      this.props.deleteNote(elem);
    }

    let items = this.state.selected.length;
    this.setState({
      selected: [],
      openDeleteSnack: true,
      items: items
    });
    this.props.navigation.setParams({ len: 0 });
  }
  handleArchive() {
    for (let elem of this.state.selected) {
      if (
        (this.props.notes.present.find(
          item => item.key === elem.key && item.archive === false
        ) &&
          this.state.selectedTab === 0) ||
        this.state.selectedTab === 2
      ) {
        this.props.setArchive({ archive: !elem.archive }, elem.key);
        let items = this.state.selected.length;

        this.setState({
          selected: [],
          openArchiveSnack: true,
          items: items
        });
        this.props.navigation.setParams({ len: 0 });
      } else {
        this.setState({
          infoSnack: true
        });
        this.setState({
          selected: []
        });
        this.props.navigation.setParams({ len: 0 });
      }
    }
  }

  async datePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date()
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
        this.props.navigation.setParams({
          date: dateObj
        });
        this.props.handleDate(Date.parse(dateObj));
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }
  handleDataCheck() {
    if (
      this.props.date === 0 &&
      this.state.firstQuery === "" &&
      this.state.selected.length === 0
    ) {
      return this.props.reselect;
    } else if (this.state.selected.length > 0) {
      return this.props.reselect;
    } else if (
      this.props.date !== 0 &&
      this.state.firstQuery === "" &&
      this.state.selected.length === 0
    ) {
      return this.props.dateSelect;
    } else if (this.props.date === 0 && this.state.firstQuery !== "") {
      return this.props.search;
    } else if (
      this.props.date !== 0 &&
      this.state.firstQuery !== "" &&
      this.state.selected.length === 0
    ) {
      return this.props.dateSelectWithQuery;
    }
  }

  render() {
    const dateParam = this.props.navigation.getParam("date");
    const CopilotTabs = ({ copilot }) => {
      return (
        <SafeAreaView {...copilot}>
          <MaterialTabs
            items={["Všetky", "Obľubené", "Archív"]}
            selectedIndex={this.state.selectedTab}
            onChange={this.setTab}
            barColor={
              this.state.selected.length > 0 && this.state.selected !== []
                ? "grey"
                : this.props.theme.primary
            }
            indicatorColor="white"
            activeTextColor="white"
          />
        </SafeAreaView>
      );
    };

    const CopilotList = ({ copilot }) => {
      return (
        <View {...copilot} style={styles.copilot}>
          <ScrollView style={styles.scrollStyle}>
            <FlatList
              data={this.handleDataCheck()}
              renderItem={({ item }) => (
                <View>
                  <List.Item
                    key={item.key}
                    title={item.title}
                    description={
                      item.text
                        ? item.text
                        : item.list.length >= 3
                        ? `${item.list[0].text}, ${item.list[1].text}, ${
                            item.list[2].text
                          }...`
                        : `${item.list[0].text + "..."}`
                    }
                    style={
                      this.state.selected.includes(item)
                        ? { backgroundColor: "#b2b2b2" }
                        : item.color && item.color !== this.props.theme.primary
                        ? { backgroundColor: `${item.color}`, opacity: 0.9 }
                        : { backgroundColor: `#ffffff` }
                    }
                    onPress={() => {
                      this.props.selectNote(item);
                      this.props.navigation.navigate("Details", {
                        title: item.title,
                        color: item.color,
                        id: item.key
                      });
                    }}
                    onLongPress={() => {
                      this.handleSelect(item);
                      this.props.navigation.setParams({
                        len: this.state.selected.length
                      });
                    }}
                    left={props => (
                      <List.Icon
                        style={styles.iconStyle}
                        {...props}
                        icon={item.text ? "note" : "list"}
                      />
                    )}
                    right={props => (
                      <View>
                        <Animatable.View
                          animation={item.star ? "zoomIn" : undefined}
                        >
                          <IconButton
                            {...props}
                            color={item.star ? "gold" : "gray"}
                            icon="star"
                            style={
                              dateParam === ""
                                ? { marginLeft: 13 }
                                : { marginLeft: 5 }
                            }
                            onPress={() => {
                              console.log("pressed", item.title);
                              this.props.toggleFavorites(
                                { star: !item.star },
                                item.key
                              );
                            }}
                          />
                        </Animatable.View>
                        <Text style={{ textAlign: "center", marginRight: 10 }}>
                          {dateParam === ""
                            ? moment(item.date).format("DD.MM.YY")
                            : moment(item.date).format("HH:mm")}
                        </Text>
                      </View>
                    )}
                  />
                  <Divider />
                </View>
              )}
            />
          </ScrollView>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.loading}
          textContent={"Fetching items..."}
          textStyle={{ color: "white" }}
        />
        <GestureRecognizer
          onSwipe={(direction, state) => this.onSwipe(direction, state)}
          style={{
            flex: 1,
            backgroundColor: this.state.backgroundColor
          }}
        >
          {!this.state.renderBack ? (
            <CopilotStep
              text="Prepínanie záložiek možno ovládať stlačením, ako aj pohybom prsta po obrazovke"
              order={1}
              name="tabs"
            >
              <CopilotTabs />
            </CopilotStep>
          ) : (
            <SafeAreaView {...copilot}>
              <MaterialTabs
                items={["Všetky", "Obľubené", "Archív"]}
                selectedIndex={this.state.selectedTab}
                onChange={this.setTab}
                barColor={
                  this.state.selected.length > 0 && this.state.selected !== []
                    ? "grey"
                    : this.props.theme.primary
                }
                indicatorColor="white"
                activeTextColor="white"
              />
            </SafeAreaView>
          )}

          <View style={styles.headerStyle}>
            <Searchbar
              placeholder="Vyhľadať"
              theme={{ colors: { primary: this.props.theme.primary } }}
              onChangeText={query => {
                this.setState({ firstQuery: query });
                this.props.setQuery(query);
              }}
              onIconPress={query => {
                this.setState({ firstQuery: query });
                this.props.setQuery(query);
              }}
              value={this.state.firstQuery}
            />
          </View>

          {!this.state.renderBack ? (
            <CopilotStep
              order={2}
              name="list"
              text="Tu sa nachádzajú vaše poznámky a zoznamy, krátkym stlačením prejdete na jednotlivú položku, dlhým stlačením ju označíte, označené položky možno následne vymazať alebo archivovať"
            >
              <CopilotList />
            </CopilotStep>
          ) : (
            <ScrollView style={styles.scrollStyle}>
              <FlatList
                data={this.handleDataCheck()}
                renderItem={({ item }) => (
                  <Animatable.View animation="slideInLeft">
                    <List.Item
                      key={item.key}
                      title={item.title}
                      description={
                        item.text
                          ? item.text
                          : item.list.length >= 3
                          ? `${item.list[0].text}, ${item.list[1].text}, ${
                              item.list[2].text
                            }...`
                          : `${item.list[0].text + "..."}`
                      }
                      style={
                        this.state.selected.includes(item)
                          ? { backgroundColor: "#b2b2b2" }
                          : item.color &&
                            item.color !== this.props.theme.primary
                          ? { backgroundColor: `${item.color}`, opacity: 0.9 }
                          : { backgroundColor: `#ffffff` }
                      }
                      onPress={() => {
                        this.props.selectNote(item);
                        this.props.navigation.navigate("Details", {
                          title: item.title,
                          color: item.color,
                          id: item.key
                        });
                      }}
                      onLongPress={() => {
                        this.handleSelect(item);
                        this.props.navigation.setParams({
                          len: this.state.selected.length
                        });
                      }}
                      left={props => (
                        <List.Icon
                          style={styles.iconStyle}
                          {...props}
                          icon={item.text ? "note" : "list"}
                        />
                      )}
                      right={props => (
                        <View>
                          <Animatable.View
                            animation={item.star ? "zoomIn" : undefined}
                          >
                            <IconButton
                              {...props}
                              color={item.star ? "gold" : "gray"}
                              icon="star"
                              style={
                                dateParam === ""
                                  ? { marginLeft: 13 }
                                  : { marginLeft: 5 }
                              }
                              onPress={() => {
                                console.log("pressed", item.title);
                                this.props.toggleFavorites(
                                  { star: !item.star },
                                  item.key
                                );
                              }}
                            />
                          </Animatable.View>
                          <Text
                            style={{ textAlign: "center", marginRight: 10 }}
                          >
                            {dateParam === ""
                              ? moment(item.date).format("DD.MM.YY")
                              : moment(item.date).format("HH:mm")}
                          </Text>
                        </View>
                      )}
                    />
                    <Divider />
                  </Animatable.View>
                )}
              />
            </ScrollView>
          )}

          <View style={styles.container}>
            <FabComponent navigation={this.props.navigation} />
          </View>

          {this.state.selected.length > 0 && this.state.selected !== [] ? (
            <HomeAppBar
              openDatePicker={this.datePicker}
              handleDelete={this.handleDelete}
              handleArchive={this.handleArchive}
            />
          ) : (
            undefined
          )}
        </GestureRecognizer>
        <Snackbar
          visible={this.state.openArchiveSnack}
          onDismiss={() => {
            this.setState({ openArchiveSnack: false });
          }}
          duration={2000}
        >
          {this.state.selectedTab !== 2
            ? `V archíve ${
                this.state.items === 1 || this.state.items > 4 ? "je" : "sú"
              } ${this.state.items} ${
                this.state.items === 1
                  ? "položka"
                  : this.state.items < 5
                  ? "položky"
                  : "položiek"
              }`
            : `${this.state.items} ${
                this.state.items === 1
                  ? "položka"
                  : this.state.items < 5
                  ? "položky"
                  : "položiek"
              } ${
                this.state.items === 1
                  ? "bola vytiahnutá z archívu"
                  : this.state.items < 5
                  ? "boli vytiahnuté z archívu"
                  : "bolo vytiahnutých z archívu"
              }`}
        </Snackbar>
        <Snackbar
          visible={this.state.openDeleteSnack}
          onDismiss={() => {
            this.setState({ openDeleteSnack: false });
          }}
          action={{
            label: "Späť",
            onPress: () => {
              for (let elem of this.state.undoable) {
                store.dispatch(ActionCreators.undo());
                this.setState({
                  undoable: this.state.undoable.filter(
                    item => item.key !== elem.key
                  )
                });
              }
            }
          }}
          duration={5000}
        >
          {`${
            this.state.items === 1
              ? "Vymazaná"
              : this.state.items < 5
              ? "Vymazané"
              : "Vymazaných"
          } ${this.state.items} ${
            this.state.items === 1
              ? "položka"
              : this.state.items < 5
              ? "položky"
              : "položiek"
          }`}
        </Snackbar>
        <Snackbar
          visible={this.state.infoSnack}
          onDismiss={() => {
            this.setState({ infoSnack: false });
          }}
          action={{
            label: "Ok",
            onPress: () => {
              this.setState({ infoSnack: false });
            }
          }}
          duration={3000}
        >
          Táto položka sa už nachádza v archíve
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  copilot: {
    flex: 60,
    marginTop: 5,
    paddingBottom: 10
  },
  textStyle: {
    marginTop: 20,
    alignSelf: "center",
    marginBottom: 20
  },
  navBarStyle: {
    marginTop: 55,
    paddingTop: 15
  },
  scrollStyle: {
    lineHeight: 1
  },
  headerStyle: {
    display: "flex",
    justifyContent: "center"
  },
  iconStyle: {
    marginTop: 15
  },
  viewStyle: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 0
  },
  headerButton: {
    marginRight: 0
  }
});
const mapStateToProps = state => {
  return {
    notes: state.notes,
    selectedNote: state.selectedNote,
    filter: state.filter,
    query: state.query,
    date: state.date,
    dateSelect: getDateVisibleNotes(state),
    reselect: getVisibleNotes(state),
    search: getVisibleNotesWithTextQuery(state),
    dateSelectWithQuery: dateSelectWithQuery(state),
    theme: state.theme
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      selectNote: selectNote,
      deleteNote: deleteNote,
      toggleFavorites: toggleFavorites,
      setArchive: setArchive,
      setFilter: setFilter,
      setQuery: setQuery,
      saveNote: saveNote,
      handleDate: handleDate,
      FABToggle: FABToggle,
      setThemeCache: setThemeCache
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
    animated: true
    // or false
  })(Home)
);
