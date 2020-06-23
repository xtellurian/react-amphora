import * as React from 'react'
import { BasicAmphora } from 'amphoradata'
import { SearchDispatch } from 'react-amphora'
import { withSearchDispatch } from 'react-amphora'

class SearchBar extends React.PureComponent<
    SearchDispatch,
    { results: BasicAmphora[]; term: string }
> {
    constructor(props: SearchDispatch) {
        super(props)
        this.state = {
            results: [],
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

export default withSearchDispatch(SearchBar)
