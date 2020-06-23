import * as React from 'react'
import { SearchState } from 'react-amphora'
import { withSearchState } from 'react-amphora'

class SearchResults extends React.PureComponent<
    SearchState
> {
    constructor(props: SearchState) {
        super(props)
        this.state = {
            results: [],
            term: ''
        }
        console.log(this.props)
    }

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

export default withSearchState(SearchResults)
