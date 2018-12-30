import {combineReducers } from "redux";
import notesReducer from "./notesReducer";
import selectedNoteReducer from "./selectedNoteReducer"
import titleReducer from "./titleReducer"
import filterReducer from "./filterReducer";
import queryReducer from "./queryReducer";
import dateReducer from "./dateReducer";



const rootReducer = combineReducers({
    notes: notesReducer,
    selectedNote: selectedNoteReducer,
    title: titleReducer,
    filter: filterReducer,
    query: queryReducer,
    date: dateReducer,
    
})

export default rootReducer