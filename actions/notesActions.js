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

export {saveNote, selectNote}