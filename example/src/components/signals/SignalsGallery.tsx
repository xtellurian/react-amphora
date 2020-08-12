import * as React from 'react'
import { SignalsChart, SignalsChartErrorBoundary } from 'react-amphora'
import { CopyBlock, dracula } from 'react-code-blocks'
import Select, { ValueType, OptionTypeBase } from 'react-select'
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker'

import 'react-modern-calendar-datepicker/lib/DatePicker.css'
import { ChartRange } from '../../../../dist/components/tsi/ChartRange'

const text = `<Components.SignalsChart
    amphoraId='4c3ebb15-fac8-4445-abd5-06b3848bfbd4'
    legend='shown'
    noAnimate={true}
    range={chartRange} // use the date range picker
/>`
interface SelectSignalOption extends OptionTypeBase {
    label: string
    value: string // the amphora id
}

const toChartRange = (input: DayRange): ChartRange => {
    const range: ChartRange = {}
    if (input.from) {
        let monthNumber = input.from.month - 1
        if (monthNumber < 0) {
            monthNumber = 12
        }
        range.from = new Date(
            input.from.year,
            monthNumber,
            input.from.day,
            0,
            0,
            0,
            0
        )
    }
    if (input.to) {
        let monthNumber = input.to.month - 1
        if (monthNumber < 0) {
            monthNumber = 12
        }
        range.to = new Date(
            input.to.year,
            monthNumber,
            input.to.day,
            0,
            0,
            0,
            0
        )
    }

    return range
}

const signalOptions: SelectSignalOption[] = [
    { value: '4c3ebb15-fac8-4445-abd5-06b3848bfbd4', label: 'Forecasts' },
    { value: '47a0fae5-aa15-468e-8b24-2771c58dc7b1', label: 'Observations' }
]

const MelbourneWeather: React.FunctionComponent = (props) => {
    const [dayRange, setDayRange] = React.useState<DayRange>({
        from: null,
        to: null
    })

    // this is the same as the code below
    const [option, selectOption] = React.useState(signalOptions[0])
    const handleChange = (possibleValue: ValueType<SelectSignalOption>) => {
        if (!possibleValue) return
        selectOption(possibleValue as SelectSignalOption)
    }

    return (
        <React.Fragment>
            <h4>Component Example</h4>
            <div className='row'>
                <div className='col'>
                    <DatePicker
                        value={dayRange}
                        onChange={setDayRange}
                        inputPlaceholder='Select a range'
                    />
                </div>
                <div className='col'></div>
            </div>
            <Select
                value={option}
                onChange={(o) => handleChange(o)}
                options={signalOptions}
            />
            <h5>Example Code</h5>
            <CopyBlock text={text} language='typescript' theme={dracula} />
            <hr />
            <h5>Melbourne Weather ({option.label})</h5>
            <SignalsChartErrorBoundary>
                <SignalsChart
                    amphoraId={option.value}
                    legend='shown'
                    noAnimate={true}
                    range={toChartRange(dayRange)}
                />
            </SignalsChartErrorBoundary>
            {props.children}
        </React.Fragment>
    )
}

export default MelbourneWeather
