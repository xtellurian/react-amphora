import * as React from 'react'
import { tsiClient } from './tsiClient'
const defaultChartStyle: React.CSSProperties = {
    minHeight: '25rem'
}
interface ChartState {
    lineChart?: any
}

export interface ChartOptions {
    dateLocale?: string
    includeDots?: boolean
    includeEnvelope?: boolean
    grid?: boolean
    legend?: 'shown' | 'compact' | 'hidden'
    noAnimate?: boolean
    offset?: string
    strings?: any
    theme?: 'light' | 'dark'
    tooltip?: boolean
    yAxisState?: 'stacked' | 'shared' | 'overlap'
    yExtent?: null | [number, number]
}

interface TsiChartComponentProps {
    data: any
    chartOptions: ChartOptions
    divId?: string | undefined
    chartStyle?: React.CSSProperties | undefined
}
export const TsiChartComponent: React.FunctionComponent<TsiChartComponentProps> = (
    props
) => {
    const [state, setState] = React.useState<ChartState>({})

    React.useEffect(() => {
        if (!state.lineChart) {
            const chartRef = document.getElementById('tsichart')
            const lineChart = new tsiClient.ux.LineChart(chartRef)
            setState({
                ...state,
                lineChart
            })

            lineChart.render(props.data, props.chartOptions)
        }
    }, [])

    return (
        <div
            style={props.chartStyle || defaultChartStyle}
            id={props.divId || 'tsichart'}
        >
            {props.children}
        </div>
    )
}
