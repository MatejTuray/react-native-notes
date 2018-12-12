import {combineReducers } from "redux";
import notesReducer from "./notesReducer";
import selectedNoteReducer from "./selectedNoteReducer"
import titleReducer from "./titleReducer"

const rootReducer = combineReducers({
    notes: notesReducer,
    selectedNote: selectedNoteReducer,
    title: titleReducer,
})

export default rootReducer