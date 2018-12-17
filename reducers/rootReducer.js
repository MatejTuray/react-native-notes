import {combineReducers } from "redux";
import notesReducer from "./notesReducer";
import selectedNoteReducer from "./selectedNoteReducer"
import titleReducer from "./titleReducer"
import filterReducer from "./filterReducer";
import queryReducer from "./queryReducer";
import listReducer from "./listReducer";


const rootReducer = combineReducers({
    notes: notesReducer,
    selectedNote: selectedNoteReducer,
    title: titleReducer,
    filter: filterReducer,
    query: queryReducer,
    list: listReducer,
})

export default rootReducer