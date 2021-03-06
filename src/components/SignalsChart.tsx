import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { Signal } from 'amphoradata'
import { useConfigState } from '../context/ConfigurationContext'
import { useAmphoraClients } from '../context/ApiClientContext'
import { getData } from './tsi/tsiClient'
// eslint-disable-next-line no-unused-vars
import { TsiChartComponent, ChartOptions } from './tsi/TsiChartComponent'

import 'tsiclient/tsiclient.css'
// eslint-disable-next-line no-unused-vars
import { ChartRange, defaultRange } from './tsi/ChartRange'

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
    amphoraId: string
    range: ChartRange
    loading: boolean
    signals: Signal[]
    signalsLoaded: boolean
    data?: any
    dataLoaded: boolean
}

export interface SignalsChartProps extends ChartOptions {
    amphoraId: string
    range?: ChartRange | undefined
    signals?: Signal[] | undefined
    chartStyle?: React.CSSProperties | undefined
    loadingComponent?: React.ReactNode
    emptyComponent?: React.ReactNode
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

const initialState = (
    amphoraId: string,
    range?: ChartRange,
    signals?: Signal[]
): SignalsChartState => {
    return {
        amphoraId,
        range: range || defaultRange(),
        loading: false,
        signals: signals || [],
        signalsLoaded: (signals && signals.length > 0) || false,
        dataLoaded: false
    }
}

export const SignalsChart: React.FunctionComponent<SignalsChartProps> = (
    props
) => {
    const [state, setState] = React.useState<SignalsChartState>(
        initialState(props.amphoraId, props.range, props.signals)
    )

    // the order of useEffect matters...
    // react to change in ChartRange
    React.useEffect(() => {
        if (!state.loading && props.range) {
            if (props.range !== state.range) {
                console.log('range changed. Reloading chart...')
                setState(
                    initialState(props.amphoraId, props.range, state.signals)
                )
                console.log(props)
            }
        }
    }, [props.range, state.loading])

    // react to change in Amphora Id
    React.useEffect(() => {
        if (!state.loading && props.amphoraId !== state.amphoraId) {
            console.log('amphoraId changed. Reloading chart...')
            setState(initialState(props.amphoraId, props.range, props.signals))
        }
    }, [props.amphoraId, state.loading])

    const context = useConfigState()
    const clients = useAmphoraClients()

    React.useEffect(() => {
        const needsSignals = !state.signals || !state.signals.length
        console.log('signals effect triggered')
        console.log(state)
        if (context.isAuthenticated && needsSignals && !state.signalsLoaded) {
            console.log('Fetching Signals...')
            clients.amphoraeApi
                .amphoraeSignalsGetSignals(props.amphoraId)
                .then((r) => {
                    setState({
                        ...state,
                        signals: r.data.filter(
                            (s) => s.valueType === 'Numeric'
                        ),
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
    }, [context.isAuthenticated, state.amphoraId])

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
                state.range,
                '30m'
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

    let host = context.configuration.basePath || 'app.amphoradata.com'
    if (host.startsWith('https://')) {
        host = host.substring('https://'.length)
    }

    if (host.startsWith('http://')) {
        host = host.substring('http://'.length)
    }

    // fetch the data effect
    React.useEffect(() => {
        if (
            context.isAuthenticated &&
            !state.dataLoaded &&
            state.signalsLoaded &&
            !state.loading &&
            state.signals.length > 0
        ) {
            setState({ ...state, loading: true })
            const cancel = fetchData(
                `${host}/api`,
                context.token,
                state.signals
            )
            return () => cancel()
        }
        // catch all return
        return () => console.log('no data fetch to cancel')
    }, [
        state.range,
        context.isAuthenticated,
        state.signals,
        state.signals,
        context.configuration.basePath
    ])

    if (!context.isAuthenticated) {
        return <React.Fragment>Authentication Required</React.Fragment>
    }

    const loading = props.loadingComponent || <span>Loading...</span>
    const renderIfEmpty = (): React.ReactNode | undefined => {
        if (state.loading) {
            return null
        } else if (state.signals.length === 0) {
            return props.emptyComponent || <div>No Signals Found</div>
        } else {
            return null
        }
    }
    return (
        <React.Fragment>
            {state.loading && loading}
            {renderIfEmpty()}
            {state.data === null ? (
                <div>Oops! The data can't be rendered</div>
            ) : null}
            {state.data && (
                <TsiChartComponent
                    chartOptions={loadOptions(props)}
                    data={state.data}
                    chartStyle={props.chartStyle}
                    divId={`tsichart-${props.amphoraId}`}
                />
            )}
        </React.Fragment>
    )
}
