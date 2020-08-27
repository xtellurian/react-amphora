import * as React from 'react'
import { TextFileRenderer } from './TextFileRenderer'
import { ImageFileRenderer } from './ImageFileRenderer'
import { useAmphoraClients } from '../..'

interface FileRendererProps {
    amphoraId: string
    file: string
    mimeType?: 'text/plain' | 'image/jpeg' | 'image/png' | undefined
}

export const FileRenderer: React.FC<FileRendererProps> = (props) => {
    const clients = useAmphoraClients()
    const [mimeType, setMimeType] = React.useState<string | undefined>(
        props.mimeType
    )

    if (!mimeType) {
        // get the mime type
        clients.amphoraeApi
            .amphoraeFilesReadFileAttributes(props.amphoraId, props.file)
            .then((r) => {
                if (r.data.ContentType) {
                    setMimeType(`${r.data.ContentType}`)
                } else if (r.data.contentType) {
                    setMimeType(`${r.data.contentType}`)
                } else if (r.data.contenttype) {
                    setMimeType(`${r.data.contenttype}`)
                } else {
                    console.log('Content Type was empty')
                    setMimeType('') // set to empty string for default
                }
            })
            .catch((e) => {
                console.log(e)
            })
    }
    switch (mimeType) {
        case undefined:
            return <React.Fragment>Loading...</React.Fragment>
        case 'text/plain':
            return <TextFileRenderer {...props} />
        case 'image/jpeg':
        case 'image/png':
            return <ImageFileRenderer {...props} />
        default:
            return <React.Fragment>Unknown MIME Type</React.Fragment>
    }
}
