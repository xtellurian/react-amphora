import * as React from 'react'
import FetchMyAmphoraButtons from './FetchMyAmphoraButtons'
import MyAmphoraResults from './MyAmphoraResults'
export const MyAmphoraExample: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <FetchMyAmphoraButtons />
            <hr/>
            <MyAmphoraResults />
        </React.Fragment>
    )
}