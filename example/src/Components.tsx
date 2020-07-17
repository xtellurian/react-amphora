import * as React from 'react'
import { Route } from 'react-router-dom'
import ExampleChart from './components/signals/ChartExample'
import { SignInButtonExample } from './components/buttons/SignInButton'
export const Components: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <Route path='/components/signals-chart'>
                <ExampleChart />
            </Route>
            <Route path='/components/signin-button'>
                <SignInButtonExample />
            </Route>
        </React.Fragment>
    )
}
