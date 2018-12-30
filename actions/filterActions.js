const setFilter = (selectedTab) => {
    return {
        type: "SET_FILTER",
        payload: selectedTab,
    }
}
const setQuery = (text) => {
    return {
        type: "QUERY",
        payload: text
    }
}
const handleDate = (date) =>{
    return{
        type: "DATE",
        payload: date
    }
}

export {setFilter, setQuery, handleDate}