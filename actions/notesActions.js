const saveNote = (note) => {
    return {
        type: "SAVE_NOTE",
        payload: note
    
    }
}
const selectNote = (note) => {
    return {
        type: "SELECTED_NOTE",
        payload: note
    
    }
}
const updateNote = (note, key) => {
    return {
        type: "UPDATE_NOTE",
        payload: note,
        key: key
    }
}
const deleteNote = (note) => {
    return {
        type: "DELETE_NOTE",
        payload: note,
        
    }
}
const setTitle = (title) => {
    return {
        type: "SET_TITLE",
        payload: title
    }
}

export {saveNote, selectNote, updateNote, deleteNote, setTitle}