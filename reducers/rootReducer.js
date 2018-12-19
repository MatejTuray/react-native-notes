import {combineReducers } from "redux";
import notesReducer from "./notesReducer";
import selectedNoteReducer from "./selectedNoteReducer"
import titleReducer from "./titleReducer"
import filterReducer from "./filterReducer";
import queryReducer from "./queryReducer";



const rootReducer = combineReducers({
    notes: notesReducer,
    selectedNote: selectedNoteReducer,
    title: titleReducer,
    filter: filterReducer,
    query: queryReducer,
    
})

export default rootReducer