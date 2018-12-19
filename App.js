import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppContainer from "./containers/AppContainer"
import {Provider} from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'
import {store, persistor} from "./configStore"
import SplashScreen from "./components/SplashScreen";
import {View, Alert, Platform} from "react-native"
import { Notifications, Linking } from "expo";
import {StatusBar} from 'react-native';
import {ActionCreators} from "redux-undo"
import axios from "axios"

export default class App extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  

  componentDidMount(){
    if (Platform.OS === 'android') {
      Expo.Notifications.createChannelAndroidAsync('reminders', {
        name: 'Reminders',
        description: "scheduled reminders notes app",
        priority: 'max',
        sound: true,
        vibrate: [0, 250, 250, 250],
        badge: true
      });
    }
  
  
    Notifications.addListener((notif) => {
      console.log(notif)
      console.log(notif.data)
      
    })
  }
   
    
  
  componentWillUnmount(){
    store.dispatch(ActionCreators.clearHistory())
    console.log("clearing history")
  }
  render() {
        return (
      <Provider store={store}>
        <PersistGate loading={<SplashScreen/>} persistor={persistor}>
      <PaperProvider>
                <View style={{flex: 1}}> 
                <StatusBar  translucent backgroundColor="rgba(0,0,0,0.2)"/>
                <AppContainer />
                
                </View>  
      </PaperProvider>
      </PersistGate>
      </Provider>
    )
  }
}






