const dateReducer = (state = 0, action) => {
    switch (action.type){
        case "DATE":
            console.log(action.payload)
            return action.payload
        default:
            return state
    }

}

export default dateReducer