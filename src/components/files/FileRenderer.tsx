import * as React from 'react'
import { useAmphoraClients } from '../../context/ApiClientContext'

interface FileRendererProps {
    amphoraId: string
    file: string
    mimeType: 'text/plain'
}
interface FileRendererState {
    loading: boolean
    error?: any
    stringContents?: string
}

export const FileRenderer: React.FC<FileRendererProps> = (props) => {
    const clients = useAmphoraClients()
    const [state, setState] = React.useState<FileRendererState>({
        loading: true
    })

    React.useEffect(() => {
        if (clients.isAuthenticated) {
            clients.amphoraeApi
                .amphoraeFilesDownloadFile(props.amphoraId, props.file)
                .then((r) =>
                    setState({
                        loading: false,
                        stringContents: `${r.data}` // ensure stringy
                    })
                )
                .catch((e) => setState({ loading: false, error: e }))
        }
    }, [clients.isAuthenticated])

    if (!clients.isAuthenticated) {
        return <React.Fragment>Authentication Required</React.Fragment>
    } else if (state.loading) {
        return <React.Fragment>Loading...</React.Fragment>
    } else if (state.stringContents) {
        return <div>{state.stringContents}</div>
    } else {
        return <React.Fragment>Nothing to display</React.Fragment>
    }
}
