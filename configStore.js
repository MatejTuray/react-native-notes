import {createStore, applyMiddleware} from "redux"
import rootReducer from "./reducers/rootReducer"
import { persistStore, persistReducer,  } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
import { newHistory } from 'redux-undo'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import logger from 'redux-logger'
const persistConfig = {
    key: 'root',
    storage,        
    stateReconciler: hardSet,
    blacklist: ["query", "list", "selectedNote", "title", "date"]
  }
  
  
  const persistedReducer = persistReducer(persistConfig,rootReducer)
  

    let store = createStore(persistedReducer)
    let persistor = persistStore(store)
    // persistor.purge().then((res) => console.log(res))
    
export {store, persistor}