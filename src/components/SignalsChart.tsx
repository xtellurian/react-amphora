import * as React from 'react'
import { useConfigState } from '../context/ConfigurationContext'
import { useAmphoraClients } from '../context/ApiClientContext'
import { getData } from './tsi/tsiClient'
// eslint-disable-next-line no-unused-vars
import { TsiChartComponent, ChartOptions } from './tsi/TsiChartComponent'
// eslint-disable-next-line no-unused-vars
import { Signal } from 'amphoradata'

import 'tsiclient/tsiclient.css'

const timezone = 'Local'
const defaultOptions: ChartOptions = {
    theme: 'light',
    grid: true,
    tooltip: true,
    legend: 'shown',
    yAxisState: 'stacked',
    noAnimate: false,
    includeDots: false,
    offset: timezone,
    includeEnvelope: true,
    dateLocale: 'en-AU',
    strings: { 'Display Grid': 'Show Table' }
}

interface SignalsChartState {
    loading: boolean
    signals: Signal[]
    signalsLoaded: boolean
    data?: any
    dataLoaded: boolean
}

export interface SignalsChartProps extends ChartOptions {
    amphoraId: string
    signals?: Signal[] | undefined
    chartStyle?: React.CSSProperties | undefined
    loadingComponent?: React.ReactNode
}

function loadOptions(incoming?: ChartOptions) {
    if (!incoming) {
        return defaultOptions
    } else {
        const options = { ...defaultOptions }
        Object.keys(incoming).forEach((key) => {
            options[key] = incoming[key]
        })
        return options
    }
}

export const SignalsChart: React.FunctionComponent<SignalsChartProps> = (
    props
) => {
    const [state, setState] = React.useState<SignalsChartState>({
        loading: false,
        signals: props.signals || [],
        signalsLoaded: false,
        dataLoaded: false
    })

    const context = useConfigState()
    const clients = useAmphoraClients()
    const needsSignals = !props.signals || !props.signals.length

    if (context.isAuthenticated && needsSignals && !state.signalsLoaded) {
        console.log('Fetching Signals...')
        clients.amphoraeApi
            .amphoraeSignalsGetSignals(props.amphoraId)
            .then((r) => {
                setState({
                    ...state,
                    signals: r.data.filter((s) => s.valueType === 'Numeric'),
                    signalsLoaded: true
                })
                console.log('Signals Loaded!')
            })
            .catch((e) => console.log(`Error fetching signals ${e}`))
    } else if (props.signals) {
        setState({
            ...state,
            signals: props.signals,
            signalsLoaded: true
        })
    }

    const handleFetchDataError = (e: any) => {
        console.log(e)
        setState({
            ...state,
            loading: false,
            dataLoaded: false // prevents too much calls to server
        })
    }

    const dataCallback = (data: any) => {
        setState({
            ...state,
            loading: false,
            data,
            dataLoaded: true
        })
    }

    const fetchData = (
        url: string,
        token?: string | undefined,
        signals?: Signal[]
    ): Function => {
        if (token && signals && signals.length > 0) {
            console.log(`Fetching data from url: ${url}`)
            const [promise, cancel] = getData(
                url,
                token,
                props.amphoraId,
                state.signals,
                null,
                ''
            )
            promise
                .then((d: any) => dataCallback(d))
                .catch((e) => handleFetchDataError(e))

            return cancel
        } else {
            console.log('No authentication token. Refusing to fetch data')
            return () => console.log('Effect will not be cancelled')
        }
    }
    const host = context.configuration.basePath || 'app.amphoradata.com'

    // fetch the data effect
    React.useEffect(() => {
        if (context.isAuthenticated && !state.dataLoaded && !state.loading) {
            setState({ ...state, loading: true })
            const cancel = fetchData(
                `${host}/api`,
                context.token,
                state.signals
            )
            return () => cancel()
        } else {
            return () => console.log('nothing to cancel')
        }
    }, [context.isAuthenticated, state.signals, context.configuration.basePath])

    if (!context.isAuthenticated) {
        return <React.Fragment>Authentication Required</React.Fragment>
    }

    const loading = props.loadingComponent || <span>Loading...</span>
    return (
        <React.Fragment>
            {state.loading && loading}
            {state.data === null ? (
                <div>Oops! The data can't be rendered</div>
            ) : null}
            {state.data && (
                <TsiChartComponent
                    chartOptions={loadOptions(props)}
                    data={state.data}
                    chartStyle={props.chartStyle}
                    divId='tsichart'
                />
            )}
        </React.Fragment>
    )
}
