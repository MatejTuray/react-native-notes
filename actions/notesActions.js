const saveNote = (note) => {
    return {
        type: "SAVE_NOTE",
        payload: note
    
    }
}

export {saveNote,}