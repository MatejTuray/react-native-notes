const notesReducer = (state = [], action) => {
    switch (action.type){
        case "SAVE_NOTE":
            return [...state, action.payload]
        default:
            return state
    }

}

export default notesReducer