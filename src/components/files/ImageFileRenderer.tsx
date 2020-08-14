import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from 'axios'
import { useAmphoraClients } from '../../context/ApiClientContext'

interface ImageFileRendererProps {
    amphoraId: string
    file: string
}
interface ImageFileRendererState {
    loading: boolean
    error?: any
    src?: string
}

const toBase64ImgSrc = (response: AxiosResponse) => {
    console.log('to b64')
    const b64 = btoa(
        new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
        )
    )
    console.log(b64.length)
    return `data:;base64,${b64}`
}

export const ImageFileRenderer: React.FC<ImageFileRendererProps> = (props) => {
    const clients = useAmphoraClients()
    const [state, setState] = React.useState<ImageFileRendererState>({
        loading: true
    })

    React.useEffect(() => {
        if (clients.isAuthenticated) {
            clients.amphoraeApi
                .amphoraeFilesDownloadFile(props.amphoraId, props.file, {
                    responseType: 'arraybuffer'
                })
                .then((r) =>
                    setState({
                        loading: false,
                        src: toBase64ImgSrc(r) // ensure stringy
                    })
                )
                .catch((e) => setState({ loading: false, error: e }))
        }
    }, [clients.isAuthenticated])

    if (!clients.isAuthenticated) {
        return <React.Fragment>Authentication Required</React.Fragment>
    } else if (state.loading) {
        return <React.Fragment>Loading...</React.Fragment>
    } else if (state.src) {
        return <img src={state.src} />
    } else {
        return <React.Fragment>Nothing to display</React.Fragment>
    }
}
