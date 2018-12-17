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
    blacklist: ["query", "list",]
  }
  
  
  const persistedReducer = persistReducer(persistConfig,rootReducer)
  

    let store = createStore(persistedReducer, applyMiddleware(logger))
    let persistor = persistStore(store)
    
    
export {store, persistor}