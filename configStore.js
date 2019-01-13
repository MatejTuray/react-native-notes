import {createStore, applyMiddleware} from "redux"
import rootReducer from "./reducers/rootReducer"
import { persistStore, persistReducer,  } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
import { newHistory } from 'redux-undo'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import logger from 'redux-logger'
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
const persistConfig = {
    key: 'root',
    storage,        
    stateReconciler: hardSet,
    blacklist: ["query","list", "selectedNote", "title", "date", "fab", "cache"]
  }
  
  
  const persistedReducer = persistReducer(persistConfig,rootReducer)
  

    let store = createStore(persistedReducer)
    let persistor = persistStore(store)
    // persistor.purge().then((res) => console.log(res))
    
export {store, persistor}