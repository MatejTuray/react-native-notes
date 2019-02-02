const uuidv4 = require("uuid/v4");

const activeThemeReducer = (
  state = { primary: "#1a72b4", secondary: "#B41A34", key: "default" },
  action
) => {
  switch (action.type) {
    case "SELECTED_THEME":
      return Object.assign({}, state, {
        primary: action.payload.primary,
        secondary: action.payload.secondary,
        key: action.payload.key
      });
    default:
      return state;
  }
};

export default activeThemeReducer;
