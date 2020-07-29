import * as React from 'react'
import { Route } from 'react-router-dom'
import ExampleChart from './components/signals/ChartExample'
import { ButtonsExample } from './components/buttons/ButtonsExample'
export const Components: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <Route path='/components/signals-chart'>
                <ExampleChart />
            </Route>
            <Route path='/components/buttons'>
                <ButtonsExample />
            </Route>
        </React.Fragment>
    )
}
