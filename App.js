import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppContainer from "./containers/AppContainer"
import {Provider} from "react-redux"
import {createStore} from "redux"
import rootReducer from "./reducers/rootReducer"


export default class App extends React.Component {
  render() {
    const store = createStore(rootReducer)
    return (
      <Provider store={store}>
      <PaperProvider>
                <AppContainer />     
      </PaperProvider>
      </Provider>
    )
  }
}






