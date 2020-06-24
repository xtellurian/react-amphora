import * as React from 'react'
import { MyAmphoraContext } from 'react-amphora'

class MyAmphoraToggle extends React.PureComponent<
    MyAmphoraContext.FetchMyAmphoraDispatch
> {
    private doFetch(
        accessType: 'created' | 'purchased',
        scope: 'self' | 'organisation'
    ) {
        this.props.dispatch({
            type: 'fetch',
            payload: {
                accessType,
                scope
            }
        })
    }

    render() {
        return (
            <div>
                <h3>Fetch My Amphora </h3>
                <button onClick={() => this.doFetch('created', 'self')}>
                    Fetch Mine
                </button>
                <button onClick={() => this.doFetch('created', 'organisation')}>
                    Fetch My Organisation
                </button>
                <button onClick={() => this.doFetch('purchased', 'self')}>
                    Fetch My Purchased
                </button>
                <button
                    onClick={() => this.doFetch('purchased', 'organisation')}
                >
                    Fetch Organisation Purchased
                </button>
            </div>
        )
    }
}

export default MyAmphoraContext.withFetchMyAmphoraDispatch(MyAmphoraToggle)
