import * as React from 'react'
import { Components } from 'react-amphora'
import { CopyBlock, dracula } from 'react-code-blocks'
import Select, { ValueType, OptionTypeBase } from 'react-select'

const text = `<Components.SignalsChart
    amphoraId='4c3ebb15-fac8-4445-abd5-06b3848bfbd4'
    legend='shown'
    noAnimate={true}
/>`
interface SelectSignalOption extends OptionTypeBase {
    label: string
    value: string // the amphora id
}

const options: SelectSignalOption[] = [
    { value: '4c3ebb15-fac8-4445-abd5-06b3848bfbd4', label: 'Forecasts' },
    { value: '47a0fae5-aa15-468e-8b24-2771c58dc7b1', label: 'Observations' }
]

const MelbourneWeather: React.FunctionComponent = (props) => {
    // this is the same as the code below
    const [option, selectOption] = React.useState(options[0])
    const handleChange = (possibleValue: ValueType<SelectSignalOption>) => {
        if (!possibleValue) return
        selectOption(possibleValue as SelectSignalOption)
    }

    return (
        <React.Fragment>
            <h4>Component Example</h4>
            <h5>Melbourne Weather ({option.label})</h5>
            <Components.SignalsChart
                amphoraId={option.value}
                legend='shown'
                noAnimate={true}
            />
            {props.children}
            <Select
                value={option}
                onChange={(o) => handleChange(o)}
                options={options}
            />
            <h5>Example Code</h5>
            <CopyBlock text={text} language='typescript' theme={dracula} />
        </React.Fragment>
    )
}

export default MelbourneWeather
