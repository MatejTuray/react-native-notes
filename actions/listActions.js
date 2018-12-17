const saveList = (List) => {
    return {
        type: "SAVE_List",
        payload: List
    
    }
}
const selectList = (List) => {
    return {
        type: "SELECTED_List",
        payload: List
    
    }
}
const updateList = (List, key) => {
    return {
        type: "UPDATE_List",
        payload: List,
        key: key
    }
}
const deleteList = (List) => {
    return {
        type: "DELETE_List",
        payload: List,
        
    }
}
export {saveList, deleteList, selectList, updateList}