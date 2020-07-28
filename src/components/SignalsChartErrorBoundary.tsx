import * as React from 'react'

export class SignalsChartErrorBoundary extends React.Component<
    {},
    { hasError: boolean }
> {
    constructor(props: {}) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: any) {
        console.log(error)
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error)
        console.log(errorInfo)
        this.setState({ hasError: true })
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>
        }

        return this.props.children
    }
}
