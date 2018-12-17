import undoable from "redux-undo"
const filterReducer = (state="SHOW_ALL", action) => {
    switch (action.payload){
        case 0:            
            console.log(action.type + "" + action.payload)
            return "SHOW_ALL"
        case 1:              
            console.log(action.type + "" + action.payload)      
            return "SHOW_FAVOURITE"        
        case 2:            
            console.log(action.type + "" + action.payload)
            return "SHOW_ARCHIVED"
        default:
            return state
    }

}

export default filterReducer