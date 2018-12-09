const selectedNoteReducer = (state = [], action) => {
    switch (action.type){
        case "SELECTED_NOTE":
            return action.payload
        default:
            return state
    }

}

export default selectedNoteReducer