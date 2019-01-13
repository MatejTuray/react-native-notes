const selectedNoteReducer = (state = [], action) => {
    switch (action.type){
        case "SELECTED_NOTE":
            return action.payload
        case "CHANGE_COLOR":
            return Object.assign({} , state, {color: action.payload})
        default:
            return state
    }

}

export default selectedNoteReducer