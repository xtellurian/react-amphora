import * as React from 'react'
import { Components } from 'react-amphora'
import { CopyBlock, dracula } from "react-code-blocks"

const text = `<Components.SignalsChart
    amphoraId='4c3ebb15-fac8-4445-abd5-06b3848bfbd4'
    legend='shown'
    noAnimate={true}
/>`

const MelbourneWeather: React.FunctionComponent = (props) => {
    // this is the same as the code below
    return (
        <React.Fragment>
            <h4>Melbourne Weather</h4>
            <CopyBlock text={text} language="typescript" theme={dracula}/>
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
