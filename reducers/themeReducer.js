const uuidv4 = require("uuid/v4");

const themeReducer = (
  state = [
    {
      name: "Základná téma",
      primary: "#1a72b4",
      secondary: "#B41A34",
      key: "default"
    },
    {
      name: "Obrátená základná téma",
      primary: "#B41A34",
      secondary: "#1a72b4",
      key: uuidv4()
    }
  ],
  action
) => {
  switch (action.type) {
    case "SAVE_THEME":
      return [...state, action.payload];
    case "UPDATE_THEME":
      const updatedItems = state.map(item => {
        if (item.key === action.key) {
          return action.payload;
        }
        return item;
      });

      return updatedItems;
    case "DELETE_THEME":
      console.log(action.payload.key);
      return state.filter(item => item.key !== action.payload.key);

    default:
      return state;
  }
};
export default themeReducer;
