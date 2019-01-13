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
const toggleFavorites = (status, key) => {
    return {
        type: "TOGGLE_FAVORITES",
        payload: status,
        key: key
    }
}
const setArchive = (status, key) => {
    return {
        type: "ARCHIVE_NOTE",
        payload: status,
        key: key
    }
}
const cacheText = (note) => {
    return {
        type: "CACHE_TEXTNOTE",
        payload: note,
    }
}
const cacheList = (list) => {
    return {
        type: "CACHE_LISTNOTE",
        payload: list,
    }
}
const clearCacheNote = () => {
    return {
        type: "CLEAR_CACHE_NOTE"
    }
}
const clearCacheList = () => {
    return {
        type: "CLEAR_CACHE_LIST"
    }
}
const changeColor = (color) => {
    return {
        type: "CHANGE_COLOR",
        payload: color
    }
}

export {saveNote, selectNote, updateNote, deleteNote, setTitle, toggleFavorites, setArchive, cacheText, cacheList, clearCacheNote, clearCacheList, changeColor}