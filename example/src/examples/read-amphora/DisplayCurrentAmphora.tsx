import * as React from 'react'
import { AmphoraOperationsContext } from 'react-amphora'
export const DisplayCurrentAmphora: React.FunctionComponent = (props) => {
    const state = AmphoraOperationsContext.useAmphoraOperationsState()
    if (state.isLoading) {
        return <div>Loading...</div>
    } else if (state.current) {
        return (
            <div>
                <div>Name: {state.current.name}</div>
                <div>Description: {state.current.description}</div>
                <div>Price: {state.current.price}</div>
                <div>Terms Id: {state.current.termsOfUseId}</div>
                <div>Terms Name: {state.terms && state.terms.name}</div>
                <div>Terms Contents: {state.terms && state.terms.contents}</div>
                {props.children}
            </div>
        )
    } else {
        return <React.Fragment></React.Fragment>
    }
}
