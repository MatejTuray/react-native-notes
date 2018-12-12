import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppContainer from "./containers/AppContainer"
import {Provider} from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'
import {store, persistor} from "./configStore"
import { Bars } from 'react-native-loader';
import {View, Alert} from "react-native"
import { Notifications } from "expo";
import {StatusBar} from 'react-native';
export default class App extends React.Component {

  componentDidMount(){
    Notifications.addListener((notif) => {
      console.log(notif)
      Alert.alert(
        'Notification Recieved!',
        'Msg',
        [
          {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    })
  }
  render() {
        return (
      <Provider store={store}>
        <PersistGate loading={<View><Bars size={10} color="#FDAAFF" /></View>} persistor={persistor}>
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






