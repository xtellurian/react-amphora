import * as React from 'react'
import { BasicAmphora } from 'amphoradata'
import { withAmphora, ApiState } from 'react-amphora'

class SearchComponent extends React.PureComponent<
    ApiState,
    { results: BasicAmphora[]; term: string }
> {
    constructor(props: ApiState) {
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

        console.log(this.props.search)

        this.props.search.searchSearchAmphorae(this.state.term)
            .then((r) => this.setState({ results: r.data }))
            .catch((e) => {
                console.log(e)
                alert(`Error searching amphora: ${e}`)
            })
    }

    render() {
        return (
            <div>
                <h3>Search Amphora Component</h3>
                <input
                    type='text'
                    value={this.state.term}
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.doSearch()}>Search</button>
                <hr />
                <h4> Results </h4>
                {!this.state.results.length && 'No Search Results...'}
                {this.state.results.map((r) => {
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

export default withAmphora(SearchComponent)
