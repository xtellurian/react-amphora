import * as React from 'react'
import { SearchContext } from 'react-amphora'

class SearchResults extends React.PureComponent<SearchContext.SearchState> {
    render() {
        return (
            <div>
                <h3>Search Results</h3>

                {!this.props.results.length && 'No Search Results...'}
                {this.props.results.map((r) => {
                    return (
                        <div key={r.id || ''}>
                            {r.name} | {r.price}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default SearchContext.withSearchState(SearchResults)
