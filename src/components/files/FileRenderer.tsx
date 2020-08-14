import * as React from 'react'
import { TextFileRenderer } from './TextFileRenderer'
import { ImageFileRenderer } from './ImageFileRenderer'

interface FileRendererProps {
    amphoraId: string
    file: string
    mimeType: 'text/plain' | 'image/jpeg' | 'image/png'
}

export const FileRenderer: React.FC<FileRendererProps> = (props) => {
    switch (props.mimeType) {
        case 'text/plain':
            return <TextFileRenderer {...props} />
        case 'image/jpeg':
        case 'image/png':
            return <ImageFileRenderer {...props} />
        default:
            return <React.Fragment>Unknown mimeType</React.Fragment>
    }
}
