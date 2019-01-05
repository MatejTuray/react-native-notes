import React, { Component } from "react";
import { StyleSheet, View, Vibration } from "react-native";
import { Text, IconButton,  } from "react-native-paper";
import moment from "moment";
import FabComponent from "./FabComponent";
import HomeAppBar from "./HomeAppBar";
import { DatePickerAndroid, TouchableOpacity, SafeAreaView, Alert, Button, NetInfo} from "react-native";
import { Searchbar, List, Divider, Snackbar } from "react-native-paper";
import { connect } from "react-redux";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";
import {
  selectNote,
  deleteNote,
  toggleFavorites,
  setArchive,
  saveNote
} from "../actions/notesActions";
import { bindActionCreators } from "redux";
import MaterialTabs from 'react-native-material-tabs';
import { MaterialHeaderButtons, Item } from "./HeaderButtons";
import { getAll, getFavourite, setFilter, setQuery, handleDate } from "../actions/filterActions";
import {rootSelector, getVisibleNotes, getVisibleNotesWithTextQuery, dateSelectWithQuery, getDateVisibleNotes} from "../selectors/rootSelector";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { ActionCreators } from 'redux-undo';
import { store } from "../configStore";
import { Notifications, Linking } from "expo";
import axios from "axios"
import Spinner from 'react-native-loading-spinner-overlay';
const uuidv4 = require("uuid/v4");

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params && params.len > 0 ? `${params.len.toString()}` : params && params.date !== "" ? `${moment(params.date).format("DD/MM/YYYY")}` : "Home",
      headerStyle: {
        backgroundColor: params && params.len > 0 ? "grey" : "#1a72b4",        
        elevation: 0
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      },  
      headerRight:(
               
        <MaterialHeaderButtons key={uuidv4()}>          
        {params && params.len < 1 && params.date && params.date !== "" ? <Item key={uuidv4()} title="x" iconName="close" size={16} style={styles.headerButton} onPress={() => params.clearDate()}/>: undefined}
          <Item key={uuidv4()} title="date-range" iconName="date-range" onPress={() => params.datePicker()} />
          <Item key={uuidv4()}  title="view-module" iconName={"view-module"} onPress={() => {console.log('Pressed switch view');}} />
         
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
    this.setTab = this.setTab.bind(this)
    this.onSwipe = this.onSwipe.bind(this)
    this.handleDataCheck = this.handleDataCheck.bind(this)
    this.clearDate = this.clearDate.bind(this)
    this.state = {
      text: "",
      title: "",
      selected: [],
      change: false,
      selectedTab: 0,
      list: true,
      gestureName: 'none',
      fetching: false,
      date: ""
    };
  }
  componentWillMount(){
    this.props.navigation.setParams({
      datePicker: this.datePicker,
      clearDate: this.clearDate     
    })
    this.props.setFilter(this.state.selectedTab)
    this.props.navigation.setParams({len : 0})
  }
  componentDidMount(){
    store.dispatch(ActionCreators.clearHistory())
    console.log(this.props)
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
      this.setState({
        connection: connectionInfo.type 
      })
    });
    function handleFirstConnectivityChange(connectionInfo) {
      console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
      this.setState({
        connection: connectionInfo.type 
      })
      NetInfo.removeEventListener(
        'connectionChange',
        handleFirstConnectivityChange
      );
    }
    NetInfo.addEventListener(
      'connectionChange',
      handleFirstConnectivityChange
    );
  
    this.props.navigation.setParams({
      date: this.state.date,     
    })
    Notifications.addListener((notif) => {   
      console.log(notif.notificationId)
      if(notif.data.key && notif.data.title && notif.data.color){
        let item = this.props.notes.present.find(item => item.key === notif.data.key)        
        this.props.selectNote(item)
      this.props.navigation.navigate(`Details`, {id: item.key,  title: item.title,
      color: item.color,})
      Notifications.dismissNotificationAsync(notif.notificationId)
      }
    })
    
    Linking.addEventListener('url', (url) => {
      this._handleUrl(url)
    })
    Linking.getInitialURL().then((res) => res !== null ? this._handleUrl(res) : console.log(res)).catch(e => console.log(e))

  }
  clearDate() {
    this.props.handleDate(0)
    this.props.navigation.setParams({date: ""})
    this.setState({
      date: ""
    })
  }
  _handleUrl = url => { 
    this.setState({
      fetching: true
    }) 
    let parsed = url
    let key
    if (parsed){
      console.log(parsed) 
      try{
      key = parsed.match(/key=([^&]*)/)[1]
      }
      catch(e){
        console.log(e)
      }
      
    }
    console.log(key)
    try{
      if(key !== undefined && (this.state.connection !== "none" && this.state.connection !== "unknown")){
    axios.get(`http://192.168.1.104:5000/api/items/${key}`).then((res) => {
        console.log(res.data);
        this.setState({
          itemData: res.data
        })
        if(this.props.notes.present.find((item) => item.key === this.state.itemData.key)){
          Alert.alert("This item is already saved", `${this.state.itemData.title} @ ${moment(this.state.itemData.date).format("DD/MM/YYYY HH:mm")}`)
          this.setState({
            fetching:false
          })      }
        else{
          this.props.saveNote(this.state.itemData)
          Alert.alert("Saved", `${this.state.itemData.title} has been saved successfully`)
          axios.delete(`http://192.168.1.104:5000/api/items/${key}`).then((res) => {
            console.log(res)
          }).catch(e => console.log(e))
          this.setState({
            fetching: false
          })
        }
      }).catch((e) => Alert.alert("Invalid link", "This shareable link is no longer valid, please request a new one from note creator" ))
    } 
  }
    catch(e){
      console.log(e)
    }
  
  };
  
  setTab = selectedTab => {
    this.setState({ selectedTab });
    this.props.setFilter(selectedTab)
  };
 
  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {    
      case SWIPE_LEFT:
        console.log(this.state.gestureName)
        if(this.state.selectedTab !== 0){
          let newState = this.state.selectedTab -1
        this.setState({ 
          selectedTab: newState
         })
         this.props.setFilter(newState)
        }
        else {
          let newState = 0
          this.setState({ 
            selectedTab: newState
           })
           this.props.setFilter(newState)
        }
        break;

      case SWIPE_RIGHT:
      if(this.state.selectedTab <= 1){
        let newState = this.state.selectedTab +1
      this.setState({ 
        selectedTab: newState
       })
       this.props.setFilter(newState)}
       else{
         let newState = 2
        this.setState({ 
          selectedTab: newState
         })
         this.props.setFilter(newState)
       }
        break;
    }
  }
  componentDidUpdate(){
    console.log(this.props)
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
    })
    for (let elem of this.state.selected){
    this.props.deleteNote(elem)
    };
   
    let items = this.state.selected.length
    this.setState({
      selected: [],
      openDeleteSnack: true,
      items: items
    });
    this.props.navigation.setParams({ len: 0 });
  }
  handleArchive(){
    
    for (let elem of this.state.selected) {
      
      if(this.props.notes.present.find(item => item.key === elem.key && item.archive === false) && this.state.selectedTab === 0 || this.state.selectedTab === 2){
      this.props.setArchive({archive:!elem.archive}, elem.key);
      let items = this.state.selected.length

      this.setState({
        selected: [],
        openArchiveSnack: true,
        items: items
      });
      this.props.navigation.setParams({ len: 0 });
      
    }
      else{
        this.setState({
          infoSnack: true
        })
        this.setState({
          selected: [],
        })
        this.props.navigation.setParams({ len: 0 });
      }
    }
  
  }
  
  async datePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        
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
        })
        this.props.handleDate(Date.parse(dateObj))
        
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }
  handleDataCheck(){
    if(this.props.date === 0 && this.state.firstQuery === "" && this.state.selected.length === 0){
      return this.props.reselect
    }
    else if (this.state.selected.length > 0){
      return this.props.reselect
    }
    else if (this.props.date !== 0 && this.state.firstQuery === "" && this.state.selected.length === 0){
      return this.props.dateSelect
    }
    else if (this.props.date === 0 && this.state.firstQuery !== ""){
      return this.props.search
    }
    else if (this.props.date !== 0 && this.state.firstQuery !== "" && this.state.selected.length === 0){
      return this.props.dateSelectWithQuery
    }
   
  }

  render() {
    const config = {
      velocityThreshold: 0.2,
      directionalOffsetThreshold: 80
    };
    let swipeoutBtnsRight = [
      {
        component: (
          <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
              
          >
          <IconButton icon="delete" color="white" />
          </View>),
        onPress: () => {
          this.props.deleteNote(this.props.selectedNote);
        },
        type: "delete"
      },
      {
        component: (
          <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
              
          >
          <IconButton icon="archive" color="white" />
          </View>),
        onPress: () => {
          this.props.setArchive({archive: !this.props.selectedNote.archive}, this.props.selectedNote.key)
        },
        type: "primary"
      },
    ];

    return (
      
      <View style={styles.container}>
      <Spinner
        visible={this.state.loading}
        textContent={"Fetching items..."}
        textStyle={{color: "white"}}
        />
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
        >
        <SafeAreaView>
        <MaterialTabs
          items={["ALL", "FAVORITES", "ARCHIVED"]}
          selectedIndex={this.state.selectedTab}
          onChange={this.setTab}
          barColor={this.state.selected.length > 0 && this.state.selected !== [] ? "grey" : "#1a72b4" }
          indicatorColor="white"
          activeTextColor="white"
        />
      </SafeAreaView>
        <View style={styles.headerStyle}>
          <Searchbar
            placeholder="Search"
            onChangeText={query => {
              this.setState({ firstQuery: query });
              this.props.setQuery(query)
            }}
            onIconPress={query => {
              this.setState({ firstQuery: query });
              this.props.setQuery(query)
            }}       
            value={this.state.firstQuery}
          />
          {/* <Text style={styles.textStyle}>Your notes for {moment(this.state.date).format("LL")} </Text> */}
        </View>

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
                      ? {backgroundColor:"#b2b2b2"}
                      : item.color && item.color !== "#1a72b4"
                      ? { backgroundColor: `${item.color}`, opacity: 0.9 }
                      : { backgroundColor: `#ffffff` }
                  }
                  onPress={() => {
                    this.props.selectNote(item);
                    this.props.navigation.navigate("Details", {
                      title: item.title,
                      color: item.color,
                      id: item.key,
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
                          onPress={() => {
                            console.log("pressed", item.title);
                            this.props.toggleFavorites(
                              { star: !item.star },
                              item.key
                            );
                          }}
                        />
                      </Animatable.View>
                      <Text style={{ textAlign: "center" }}>
                        {moment(item.date).format("DD/MM")}
                      </Text>
                    </View>
                  )}
                />
                <Divider />
              </Animatable.View>
            )}
          />
        </ScrollView>

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
          {this.state.selectedTab !== 2 ? `Archived ${this.state.items} ${this.state.items === 1 ? "item" : "items"}` : `Removed ${this.state.items} ${this.state.items === 1 ? "item" : "items"} from archive`}
        </Snackbar>
        <Snackbar
          visible={this.state.openDeleteSnack}
          onDismiss={() => {
            this.setState({ openDeleteSnack: false });
            
          }}
          action={{
            label: 'Undo',
            onPress: () => {
              for (let elem of this.state.undoable){
              store.dispatch(ActionCreators.undo())
              this.setState({
                undoable: this.state.undoable.filter((item) => item.key !== elem.key)
              })
              
              }
            },
          }}
          
          duration={5000}
        >
          {`Deleted ${this.state.items} ${this.state.items === 1 ? "item" : "items"}` }
        </Snackbar>
        <Snackbar
          visible={this.state.infoSnack}
          onDismiss={() => {
            this.setState({ infoSnack: false });
            
          }}
          action={{
            label: 'Ok',
            onPress: () => {
              this.setState({ infoSnack: false });
            
            },
          }}
          
          duration={3000}
        >
          This item is already archived
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
    lineHeight: 1,    
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
  headerButton:{
    marginRight: 130
  }
});
const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    selectedNote: state.selectedNote,
    filter: state.filter,
    query: state.query,
    date: state.date,
    dateSelect: getDateVisibleNotes(state),
    reselect: getVisibleNotes(state),
    search: getVisibleNotesWithTextQuery(state),
    dateSelectWithQuery: dateSelectWithQuery(state)
   
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
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
