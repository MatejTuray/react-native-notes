const FABReducer = (state = true, action) => {
    switch (action.type){
        case "FAB_TOGGLE":
            return !state
        default:
            return state
    }

}

export default FABReducer