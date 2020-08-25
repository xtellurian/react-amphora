import * as React from 'react'
import { MyAmphoraContext } from 'react-amphora'
import { NumericInput } from '../../utility/NumericInput'

interface MyAmphoraButtonsState {
    page: number
}

class MyAmphoraToggle extends React.PureComponent<
    MyAmphoraContext.FetchMyAmphoraDispatch,
    MyAmphoraButtonsState
> {
    constructor(props: MyAmphoraContext.FetchMyAmphoraDispatch) {
        super(props)
        this.state = {
            page: 0
        }
    }
    private doFetch(
        accessType: 'created' | 'purchased',
        scope: 'self' | 'organisation'
    ) {
        this.props.dispatch({
            type: 'my-amphora:fetch-list',
            payload: {
                accessType,
                scope,
                skip: this.state.page * 64
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
                    Fetch Organisation's
                </button>
                <button onClick={() => this.doFetch('purchased', 'self')}>
                    My Purchased Amphora
                </button>
                <button
                    onClick={() => this.doFetch('purchased', 'organisation')}
                >
                    Organisation's Purchased Amphora
                </button>
                Skip Pages: 
                <NumericInput
                    onUpdate={(v) => this.setState({ page: parseInt(v) })}
                />
            </div>
        )
    }
}

export default MyAmphoraContext.withFetchMyAmphoraDispatch(MyAmphoraToggle)
