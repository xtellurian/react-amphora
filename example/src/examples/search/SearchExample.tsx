import * as React from 'react'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'
export const SearchExample: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <SearchBar />
            <SearchResults />
        </React.Fragment>
    )
}
