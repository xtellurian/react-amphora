import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { ApiState } from './apiState'

type asyncReducer<S extends { error?: any }, A> = (
    state: S,
    action: A
) => Promise<S>

const useAsyncReducer = <S extends ApiState, A>(
    reducer: asyncReducer<S, A>,
    initialState: S,
    preReducer?: (state: S, Action: A) => S
): [S, (action: any) => Promise<void>] => {
    const [state, setState] = React.useState(initialState)
    const dispatch = async (action: any) => {
        if (preReducer) {
            setState(preReducer(state, action))
        } else {
            setState({ ...state, isLoading: true })
        }

        const result = reducer(state, action)
        if (typeof result.then === 'function') {
            try {
                const newState = await result
                setState(newState)
            } catch (err) {
                setState({ ...state, error: err })
            }
        } else {
            // this is when the reducer isnt actually a promise
            throw Error('Error in Async reducer')
            // setState(result)
        }
    }

    return [state, dispatch]
}

export default useAsyncReducer
