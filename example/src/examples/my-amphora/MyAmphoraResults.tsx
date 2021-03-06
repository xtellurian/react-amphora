import * as React from 'react'
import { MyAmphoraContext } from 'react-amphora'

class MyAmphoraResults extends React.PureComponent<
    MyAmphoraContext.MyAmphoraState
> {
    renderLoader() {
        return <div>Loading...</div>
    }
    renderCacheSizeInfo() {
        return (
            <div className='row'>
                <div className='col'>
                    My-Created: {this.props.selfCreatedResults.length}
                </div>
                <div className='col'>
                    My-Purchased: {this.props.selfPurchasedResults.length}
                </div>
                <div className='col'>
                    Organisation-Created:{' '}
                    {this.props.organisationCreatedResults.length}
                </div>
                <div className='col'>
                    Organisation-Purchased{' '}
                    {this.props.organisationPurchasedResults.length}
                </div>
            </div>
        )
    }
    renderResults() {
        if (this.props.results.length === 0) {
            return <div>No Results</div>
        } else {
            return (
                <React.Fragment>
                    {this.props.results.map((r) => {
                        return (
                            <div key={r.id || ''}>
                                {r.name} | {r.price}
                            </div>
                        )
                    })}
                </React.Fragment>
            )
        }
    }
    render() {
        return (
            <div>
                <h3>My Amphora</h3>
                {this.renderCacheSizeInfo()}
                <h5>
                    {this.props.accessType} / {this.props.scope}
                </h5>
                {this.props.isLoading === true
                    ? this.renderLoader()
                    : this.renderResults()}
            </div>
        )
    }
}

export default MyAmphoraContext.withMyAmphoraState(MyAmphoraResults)
