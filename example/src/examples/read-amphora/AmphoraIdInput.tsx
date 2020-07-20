import * as React from 'react'
import { AmphoraOperationsContext } from 'react-amphora'
export const AmphoraIdInput: React.FunctionComponent = (props) => {
    const actions = AmphoraOperationsContext.useAmphoraOperationsDispatch()
    const load = (id: string) => {
        actions.dispatch({ type: 'amphora-operation:read', payload: { id } })
    }

    const [state, setState] = React.useState({ value: '' })

    return (
        <div>
            <input
                value={state.value}
                onChange={(e) => setState({ value: e.target.value })}
            />
            <button onClick={() => load(state.value)}>Load</button>
            {props.children}
        </div>
    )
}
