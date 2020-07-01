import * as React from 'react'
import { AmphoraOperationsContext } from 'react-amphora'
export const DisplayCurrentAmphora: React.FunctionComponent = (props) => {
    const state = AmphoraOperationsContext.useAmphoraOperationsState()
    if (state.isLoading) {
        return <div>Loading...</div>
    } else if (state.current) {
        return (
            <div>
                <div>
                    <strong>Name:</strong>
                    {state.current.name}
                </div>
                <div>
                    <strong>Description:</strong> {state.current.description}
                </div>
                <div>
                    <strong>Price:</strong> {state.current.price}
                </div>
                <div>
                    <strong>Terms Id:</strong> {state.current.termsOfUseId}
                </div>
                <div>
                    <strong>Terms Name: </strong>
                    {state.terms && state.terms.name}
                </div>
                <div>
                    <strong>Terms Contents:</strong>{' '}
                    {state.terms && state.terms.contents}
                </div>
                <div>
                    <strong>Permission Level:</strong>{' '}
                    {state.maxPermissionLevel}
                </div>
                {props.children}
            </div>
        )
    } else {
        return <React.Fragment></React.Fragment>
    }
}
