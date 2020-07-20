import * as React from 'react'
import { AmphoraIdInput } from './AmphoraIdInput'
import { DisplayCurrentAmphora } from './DisplayCurrentAmphora'

export const SpecificAmphoraMetadataExample: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <h3>Enter an Amphora ID</h3>
            <AmphoraIdInput />
            <h3>... and the metadata will render below</h3>
            <hr/>
            <DisplayCurrentAmphora />
        </React.Fragment>
    )
}
