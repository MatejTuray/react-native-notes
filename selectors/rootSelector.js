import { createSelector } from 'reselect'

 const getFilter = (state) => state.filter
 const getNotes = (state) => state.notes.present

export const getVisibleNotes = createSelector(
  [getFilter, getNotes] ,
  (filter, notes) => {
      
    switch (filter) {
      case 'SHOW_ALL':
        return notes
      case 'SHOW_FAVOURITE':
        return notes.filter(n => n.star)
      case 'SHOW_ARCHIVED':
        return notes.filter(n => n.archive)
    }
  }
)
const getQuery = (state) => state.query
export const getVisibleNotesWithTextQuery = createSelector(
    [ getVisibleNotes, getQuery ],
    (notes, query) => notes.filter(
      note => note.title.includes(query)
    )
  )
const getDate = (state) => state.date

export const getDateVisibleNotes = createSelector([getVisibleNotes, getDate],
   (notes, date) => notes.filter(note => (note.date > date) && (note.date < date + (1000*60*60*24))))


export const dateSelectWithQuery =  createSelector(
  [ getDateVisibleNotes, getQuery ],
  (notes, query) => notes.filter(
    note => note.title.includes(query)
  )
)