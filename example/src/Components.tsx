import * as React from 'react'
import { Route } from 'react-router-dom'
import ExampleChart from './components/signals/SignalsGallery'
import { ButtonsGallery } from './components/buttons/ButtonsGallery'
import { UtilityGallery } from './components/utilities/UtilityGallery'
import { FilesGallery } from './components/files/FilesGallery'
export const Components: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <Route path='/components/signals-chart'>
                <ExampleChart />
            </Route>
            <Route path='/components/buttons'>
                <ButtonsGallery />
            </Route>
            <Route path='/components/files'>
                <FilesGallery />
            </Route>
            <Route path='/components/utilities'>
                <UtilityGallery />
            </Route>
        </React.Fragment>
    )
}
