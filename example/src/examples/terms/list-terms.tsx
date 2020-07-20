import * as React from 'react'
import { TermsOfUseContext } from 'react-amphora'

export const ListTermsExample: React.FunctionComponent = (props) => {
    const context = TermsOfUseContext.useTermsState()
    const actions = TermsOfUseContext.useTermsDispatch()

    const [retries, setRetries] = React.useState(0)
    React.useEffect(() => {
        if (context.isAuthenticated && retries < 1) {
            setRetries(retries + 1)
            actions.dispatch({ type: 'terms:fetch-list' })
        }
    }, [retries, actions, context])

    return (
        <React.Fragment>
            {context.results.map((t) => (
                <div key={t.id || ''}>{t.name}</div>
            ))}
            {props.children}
        </React.Fragment>
    )
}
