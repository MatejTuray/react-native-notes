const saveTheme = theme => {
  return {
    type: "SAVE_THEME",
    payload: theme
  };
};
const selectTheme = theme => {
  return {
    type: "SELECTED_THEME",
    payload: theme
  };
};
const updateTheme = (theme, key) => {
  return {
    type: "UPDATE_THEME",
    payload: theme,
    key: key
  };
};
const deleteTheme = theme => {
  return {
    type: "DELETE_THEME",
    payload: theme
  };
};
export { saveTheme, selectTheme, updateTheme, deleteTheme };
