import * as React from 'react'
import { useAmphoraClients } from '../../context/ApiClientContext'

interface TextFileRendererProps {
    amphoraId: string
    file: string
}
interface TextFileRendererState {
    loading: boolean
    error?: any
    contents?: any
}

export const TextFileRenderer: React.FC<TextFileRendererProps> = (props) => {
    const clients = useAmphoraClients()
    const [state, setState] = React.useState<TextFileRendererState>({
        loading: true
    })

    React.useEffect(() => {
        if (clients.isAuthenticated) {
            clients.amphoraeApi
                .amphoraeFilesDownloadFile(props.amphoraId, props.file)
                .then((r) =>
                    setState({
                        loading: false,
                        contents: `${r.data}` // ensure stringy
                    })
                )
                .catch((e) => setState({ loading: false, error: e }))
        }
    }, [clients.isAuthenticated, props.amphoraId, props.file])

    if (!clients.isAuthenticated) {
        return <React.Fragment>Authentication Required</React.Fragment>
    } else if (state.loading) {
        return <React.Fragment>Loading...</React.Fragment>
    } else if (state.contents) {
        return <div>{state.contents}</div>
    } else {
        return <React.Fragment>Nothing to display</React.Fragment>
    }
}
