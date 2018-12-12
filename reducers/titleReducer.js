const notesReducer = (state = "Untitled", action) => {
    switch (action.type){
        case "SET_TITLE":
            return  action.payload 
        default:
            return state
    }

}

export default notesReducer