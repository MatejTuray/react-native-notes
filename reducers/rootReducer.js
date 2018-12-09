import {combineReducers } from "redux";
import notesReducer from "./notesReducer";
import selectedNoteReducer from "./selectedNoteReducer"

const rootReducer = combineReducers({
    notes: notesReducer,
    selectedNote: selectedNoteReducer,
})

export default rootReducer