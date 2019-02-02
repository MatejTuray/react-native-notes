import { combineReducers } from "redux";
import notesReducer from "./notesReducer";
import selectedNoteReducer from "./selectedNoteReducer";
import titleReducer from "./titleReducer";
import filterReducer from "./filterReducer";
import queryReducer from "./queryReducer";
import dateReducer from "./dateReducer";
import FABReducer from "./FABReducer";
import cacheReducer from "./cacheReducer";
import themeReducer from "./themeReducer";
import activeThemeReducer from "./activeThemeReducer";

const rootReducer = combineReducers({
  notes: notesReducer,
  selectedNote: selectedNoteReducer,
  title: titleReducer,
  filter: filterReducer,
  query: queryReducer,
  date: dateReducer,
  fab: FABReducer,
  cache: cacheReducer,
  themes: themeReducer,
  theme: activeThemeReducer
});

export default rootReducer;
