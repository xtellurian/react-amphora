import * as React from 'react'
import { SearchContext } from 'react-amphora'
import { Input, InputGroup, Label } from 'reactstrap'
import Select, { OptionTypeBase, ValueType } from 'react-select'

interface SelectLabelsOption extends OptionTypeBase {
    label: string
    value: string // the label
}

const labelOptions: SelectLabelsOption[] = [
    { value: 'actuals', label: 'Forecasts' },
    { value: 'observations', label: 'Observations' }
]

class SearchBar extends React.PureComponent<
    SearchContext.SearchDispatch & SearchContext.SearchState,
    { term: string; label?: string | undefined }
> {
    constructor(
        props: SearchContext.SearchDispatch & SearchContext.SearchState
    ) {
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
            type: 'search:execute',
            payload: { term: this.state.term, labels: this.state.label }
        })
    }

    private handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.charCode === 13) {
            this.doSearch()
        }
    }

    private handleLabelSelect(possibleValue: ValueType<SelectLabelsOption>) {
        if (!possibleValue) return
        const label = (possibleValue as SelectLabelsOption).value
        this.setState({
            term: this.state.term,
            label
        })
    }

    render() {
        return (
            <div>
                <h3>An Example Search Bar</h3>

                <Label>Label:</Label>
                <Select
                    onChange={(e) => this.handleLabelSelect(e)}
                    closeMenuOnSelect={true}
                    options={labelOptions}
                />

                <InputGroup>
                    <Input
                        type='text'
                        placeholder='Try searching for weather'
                        value={this.state.term}
                        onChange={(e) => this.handleChange(e)}
                        onKeyPress={(e) => this.handleKeyPress(e)}
                    />
                    {this.props.isLoading ? (
                        <span>Loading...</span>
                    ) : (
                        <button onClick={() => this.doSearch()}>Search</button>
                    )}
                </InputGroup>
            </div>
        )
    }
}

export default SearchContext.withSearch(SearchBar)
