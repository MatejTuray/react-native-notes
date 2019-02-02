const cacheReducer = (
  state = {
    text: "",
    note_remind: false,
    note_date: new Date(),
    note_reminderDate: "",
    note_color: "#1a72b4",
    list: [],
    list_remind: false,
    list_date: new Date(),
    list_color: "#1a72b4",
    list_reminderDate: "",
    list_itemText: ""
  },
  action
) => {
  switch (action.type) {
    case "SET_THEME_CACHE":
      return Object.assign({}, state, {
        note_color: action.payload,
        list_color: action.payload
      });
    case "CACHE_TEXTNOTE":
      return Object.assign({}, state, {
        text: action.payload.text,
        note_remind: action.payload.remind,
        note_reminderDate: action.payload.reminderDate,
        note_color: action.payload.color,
        note_date: action.payload.date
      });
    case "CACHE_LISTNOTE":
      return Object.assign({}, state, {
        list: action.payload.list,
        list_remind: action.payload.remind,
        list_reminderDate: action.payload.reminderDate,
        list_color: action.payload.color,
        list_date: action.payload.date,
        list_itemText: action.payload.listItemText
      });
    case "CLEAR_CACHE_LIST":
      return Object.assign({}, state, {
        list: [],
        list_remind: false,
        list_date: new Date(),
        list_color: action.payload
      });
    case "CLEAR_CACHE_NOTE":
      return Object.assign({}, state, {
        text: "",
        note_remind: false,
        note_date: new Date(),
        note_color: action.payload
      });
    default:
      return state;
  }
};

export default cacheReducer;
