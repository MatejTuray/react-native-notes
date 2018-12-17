import undoable from "redux-undo"
const notesReducer = (state = [], action) => {
    switch (action.type){
        case "SAVE_NOTE":
            return [...state, action.payload]
        case "UPDATE_NOTE":
        const updatedItems = state.map(item => {
            if(item.key === action.key){
                console.log(action.payload)
              return { ...item, ...action.payload }
            }
            return item
          })
          return updatedItems
        case "TOGGLE_FAVORITES":
        const updated = state.map(item => {
            if(item.key === action.key){
                console.log(action.payload)
                console.log(item)
              return { ...item, ...action.payload }
            }
            return item
          })
          return updated
        case "ARCHIVE_NOTE":
        const allNotes = state.map(item => {
            if(item.key === action.key){
                console.log(action.payload)
                console.log(item)
              return { ...item, ...action.payload }
            }
            return item
          })
          return allNotes
        case "DELETE_NOTE":
            console.log(action.payload.key)           
            return state.filter(item => item.key !== action.payload.key)
            
        default:
            return state
    }

}
function patchHistoryBloat(reducer) {
    return (state, action, ...rest) => {
      const res = reducer(state, action, ...rest);
      if (res.history.history) {
        delete res.history.history;
      }
      return res;
    };
  }
  

export default patchHistoryBloat(undoable(notesReducer))