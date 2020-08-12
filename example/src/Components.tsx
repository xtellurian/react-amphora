import * as React from 'react'
import { Route } from 'react-router-dom'
import ExampleChart from './components/signals/SignalsGallery'
import { ButtonsGallery } from './components/buttons/ButtonsGallery'
import { UtilityGallery } from './components/utilities/UtilityGallery'
export const Components: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <Route path='/components/signals-chart'>
                <ExampleChart />
            </Route>
            <Route path='/components/buttons'>
                <ButtonsGallery />
            </Route>
            <Route path='/components/utilities'>
                <UtilityGallery />
            </Route>
        </React.Fragment>
    )
}
