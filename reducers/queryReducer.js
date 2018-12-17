const queryReducer = (state = "", action) => {
    switch (action.type){
        case "QUERY":
            console.log(action.payload)
            return action.payload
        default:
            return state
    }

}

export default queryReducer