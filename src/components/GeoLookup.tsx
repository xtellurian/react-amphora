import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { FuzzySearchResponse, Result } from 'amphoradata'
import * as GeoContext from '../context/apis/GeoContext'
import styles from './components.module.css'

type GeoLookupProps = GeoContext.GeoDispatch &
    GeoContext.GeoState & {
        buttonClassName?: string
        dontClearOnSelected?: boolean
        heading?: JSX.Element
        loadingPlaceholder?: JSX.Element
        placeholder?: string
        resultElement?: (r: Result) => JSX.Element
        onResponse?: (response: FuzzySearchResponse) => void
        onResultSelected?: (selected: Result) => void
    }

class GeoLookup extends React.PureComponent<GeoLookupProps, { query: string }> {
    constructor(props: GeoLookupProps) {
        super(props)
        this.state = {
            query: ''
        }
    }

    private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ query: event.target.value })
    }

    private handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            this.doLookup()
        }
    }

    private rowElement(r: Result): JSX.Element {
        if (this.props.resultElement) {
            return this.props.resultElement(r)
        } else {
            return (
                <div
                    className={styles.result}
                    onClick={() => this.resultSelected(r)}
                    key={r.id || ''}
                >
                    {r.address?.freeformAddress}
                </div>
            )
        }
    }

    private doLookup() {
        this.props.dispatch({
            type: 'geolookup',
            payload: { query: this.state.query }
        })
    }

    private resultSelected(result: Result) {
        if (this.props.onResultSelected) {
            this.props.onResultSelected(result)
        }
        if (!this.props.dontClearOnSelected) {
            this.props.dispatch({ type: 'geolookup-clear' })
        }
    }

    private header(): JSX.Element {
        if (this.props.heading) {
            return this.props.heading
        }
        return <div className={styles.componentHeader}>GeoLocation Search</div>
    }

    private results(): JSX.Element | undefined {
        if (
            this.props.fuzzySearchResponse.results &&
            this.props.fuzzySearchResponse.results.length > 0
        ) {
            return (
                <div className={styles.resultsList}>
                    {this.props.fuzzySearchResponse.results.map((r) =>
                        this.rowElement(r)
                    )}
                </div>
            )
        } else if (
            this.props.fuzzySearchResponse.summary != null &&
            this.props.fuzzySearchResponse.summary.numResults === 0
        ) {
            return <div>No Results</div>
        } else {
            // empty fragment
            return <React.Fragment />
        }
    }

    render() {
        return (
            <div>
                {this.header()}
                <input
                    type='text'
                    placeholder={
                        this.props.placeholder || 'Search for a location'
                    }
                    value={this.state.query}
                    onKeyDown={(e) => this.handleKeyDown(e)}
                    onChange={(e) => this.handleChange(e)}
                />
                {this.props.isLoading ? (
                    this.props.loadingPlaceholder || 'Loading...'
                ) : (
                    <button
                        className={this.props.buttonClassName}
                        onClick={() => this.doLookup()}
                    >
                        Lookup
                    </button>
                )}

                {this.results()}
            </div>
        )
    }
}

export default GeoContext.withGeo(GeoLookup)
