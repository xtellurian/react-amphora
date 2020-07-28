import TsiClient from 'tsiclient'
// eslint-disable-next-line no-unused-vars
import { ChartRange } from './ChartRange'
// eslint-disable-next-line no-unused-vars
import { Signal } from 'amphoradata'
// this should only be new'd once here
const tsiClient = new TsiClient()
const MAX_RANGE_MILLISECONDS = 1000 * 60 * 60 * 24 * 30 // 30 days
function getLineChartExpressions(
    id: string,
    signals: Signal[],
    filters: any,
    from: Date,
    to: Date,
    bucketSize: string
) {
    let tsx = ''
    if (filters) {
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                if (tsx) {
                    tsx += ' AND '
                }
                tsx += `($event.${key}.${filters[key].type} ${filters[key].operator} ${filters[key].value})`
            } else console.log('Ignoring null value')
        })
    }
    if (tsx) console.log(tsx)
    let filter: any = null
    if (tsx.length > 0) {
        filter = { tsx }
    }

    const linechartTsqExpressions: any[] = []
    signals.forEach((sig: Signal) => {
        const y: { [key: string]: any } = {}
        const kind = 'numeric'
        let alias = sig.property
        if (sig.attributes && sig.attributes) {
            const a = sig.attributes
            if (a.Units) {
                // check units uppercase
                alias += ` (${a.Units})`
            }
            if (a.units) {
                // check units lowercase
                alias += ` (${a.units})`
            }
        }
        y[sig.property || ''] = {
            kind,
            // value: { tsx: `$event.${sig.property}.Double` },
            value: {
                tsx: `coalesce($event.${sig.property}.Double, toDouble($event.${sig.property}.Long))`
            },
            filter,
            aggregation: { tsx: 'avg($value)' }
        }
        const x = new tsiClient.ux.TsqExpression(
            { timeSeriesId: [id] },
            y,
            { from, to, bucketSize },
            null, // color
            alias
        )

        linechartTsqExpressions.push(x)
    })
    return linechartTsqExpressions
}

function getData(
    url: string,
    token: string,
    id: string,
    signals: Signal[],
    filters: any,
    range: ChartRange,
    bucketSize: '30m'
): [Promise<any>, Function] {
    if (!range.from) {
        range.from = new Date()
        range.from.setDate(range.from.getDate() - 5)
        console.log('setting from date')
        console.log(range)
    }

    if (!range.to) {
        range.to = new Date()
        range.to.setDate(range.from.getDate() + 2)
        console.log('setting to date')
        console.log(range)
    }

    // coerce the types with a +
    const diffTime = +range.to - +range.from

    if (diffTime > MAX_RANGE_MILLISECONDS) {
        throw new Error('Timespan greater than maximum')
    }
    if (diffTime <= 0) {
        console.log(range)
        throw new Error('Timespan is negative')
    }

    filters = null

    const linechartTsqExpressions = getLineChartExpressions(
        id,
        signals,
        filters,
        range.from,
        range.to,
        bucketSize
    )

    // const url = window.location.host + '/api'
    const [promise, cancelTrigger]: [
        Promise<any>,
        Function
    ] = tsiClient.server.getCancellableTsqResults(
        token,
        url,
        linechartTsqExpressions.map(function (ae) {
            return ae.toTsq()
        })
    )

    const secondPromise = promise
        .then((result) => {
            if (result && result.length > 0) {
                const res1 = result[0]
                if (res1.__tsiError__) {
                    throw new Error(res1.__tsiError__.title)
                }
            }
            if (result === '__CANCELLED__') {
                return Promise.reject(new Error('__CANCELLED__'))
            } else {
                const data = tsiClient.ux.transformTsqResultsForVisualization(
                    result,
                    linechartTsqExpressions
                )
                return Promise.resolve(data)
            }
        })
        .catch((e) => Promise.reject(e))

    return [secondPromise, cancelTrigger]
}

export { getData, tsiClient }
