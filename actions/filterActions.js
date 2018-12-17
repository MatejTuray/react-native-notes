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

export {setFilter, setQuery}