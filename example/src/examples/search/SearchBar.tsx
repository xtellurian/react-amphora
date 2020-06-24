import * as React from 'react'
import { SearchContext } from 'react-amphora'

class SearchBar extends React.PureComponent<
    SearchContext.SearchDispatch,
    { term: string }
> {
    constructor(props: SearchContext.SearchDispatch) {
        super(props)
        this.state = {
            term: ''
        }
    }
    private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ term: event.target.value })
    }

    private doSearch() {
        this.props.dispatch({
            type: 'search',
            payload: { term: this.state.term }
        })
    }

    render() {
        return (
            <div>
                <h3>Search Bar Component</h3>
                <input
                    type='text'
                    value={this.state.term}
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.doSearch()}>Search</button>
            </div>
        )
    }
}

export default SearchContext.withSearchDispatch(SearchBar)
