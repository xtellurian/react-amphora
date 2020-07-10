import * as React from 'react'
import { Components } from 'react-amphora'

const MelbourneWeather: React.FunctionComponent = (props) => {
    // const amphoraId = '4c3ebb15-fac8-4445-abd5-06b3848bfbd4'

    return (
        <React.Fragment>
            <h4>Melbourne Weather</h4>
            <Components.SignalsChart
                amphoraId='4c3ebb15-fac8-4445-abd5-06b3848bfbd4'
                legend='shown'
                noAnimate={true}
            />
            {props.children}
        </React.Fragment>
    )
}

export default MelbourneWeather
