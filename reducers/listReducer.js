const listReducer = (state = [], action) => {
    switch (action.type){
        case "SAVE_NOTE":
            return [...state, action.payload]
        case "UPDATE_NOTE":
        const updatedItems = state.map(item => {
            if(item.key === action.key){
                console.log(action.payload, action.key)
              return { ...item, ...action.payload }
            }
            return item
          })
          return updatedItems        
        case "DELETE_NOTE":
            console.log(action.payload.key)           
            return state.filter(item => item.key !== action.payload.key)
            
        default:
            return state
    }

}

export default listReducer