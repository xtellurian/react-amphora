import * as React from 'react'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'

export const SearchExample: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <SearchBar />
            <p>
                Amphora will automatically filter for data labelled
                'Observations' or 'Forecasts'
            </p>
            <SearchResults />
        </React.Fragment>
    )
}
