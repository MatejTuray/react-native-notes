const cacheReducer = (state = {text: "", list: []}, action) => {
    switch (action.type){
        case "CACHE_TEXTNOTE":
            return Object.assign({}, state, {text: action.payload})
        case "CACHE_LISTNOTE":
            return Object.assign({}, state, {list: action.payload})
        case "CLEAR_CACHE_LIST":
            return Object.assign({}, state, {list: []})
        case "CLEAR_CACHE_NOTE":
            return Object.assign({}, state, {text: ""})
        default:
            return state
    }

}

export default cacheReducer