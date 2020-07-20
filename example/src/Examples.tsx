import React from 'react'
import * as a10a from 'amphoradata'
import { Route } from 'react-router-dom'
import { GeoLookupComponent } from 'react-amphora'
import { SearchExample } from './examples/search/SearchExample'
import { MyAmphoraExample } from './examples/my-amphora/MyAmphoraExample'
import { CreateAmphoraExample } from './examples/create-amphora/CreateAmphoraExample'
import 'react-amphora/dist/index.css'
import './index.css'

// examples

import { AmphoraIdInput } from './examples/read-amphora/AmphoraIdInput'
import { DisplayCurrentAmphora } from './examples/read-amphora/DisplayCurrentAmphora'

import MyAmphoraButtons from './examples/my-amphora/FetchMyAmphoraButtons'
import MyAmphoraResults from './examples/my-amphora/MyAmphoraResults'
import CreateNewAmphora from './examples/create-amphora/CreateNewAmphora'
import { ListTermsExample } from './examples/terms/list-terms'
import { SpecificAmphoraMetadataExample } from './examples/read-amphora/SpecificAmphoraMetadataExample'

export const Examples = () => {
    return (
        <React.Fragment>
            <Route path='/examples/search'>
                <SearchExample />
            </Route>
            <Route path='/examples/my-amphora'>
                <MyAmphoraExample />
            </Route>
            <Route path='/examples/create-amphora'>
                <CreateAmphoraExample />
            </Route>
            <Route path='/examples/list-terms'>
                <ListTermsExample />
            </Route>
            <Route path='/examples/display-metadata'>
                <SpecificAmphoraMetadataExample />
            </Route>
            <Route path='/examples/other'>
                <MyAmphoraButtons />
                <MyAmphoraResults />
                <h3>Create an Amphora Component</h3>
                <CreateNewAmphora />
                <h3>View the metadata of an Amphora</h3>
                <AmphoraIdInput />
                <DisplayCurrentAmphora />
                <hr />
                <h3>Terms of Use</h3>
                <hr />
                <h2>Built in Components</h2>
                <GeoLookupComponent
                    onResultSelected={(r: a10a.Result) =>
                        alert(
                            `You selected ${r.address?.freeformAddress} with position ${r.position?.lat}, ${r.position?.lon}`
                        )
                    }
                />
            </Route>
        </React.Fragment>
    )
}
