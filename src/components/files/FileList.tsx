import * as React from 'react'
import { useAmphoraClients } from '../../context/ApiClientContext'

interface FileListProps {
    amphoraId: string
    orderBy?: 'Alphabetical' | 'LastModified'
    prefix?: string | undefined
    take?: number | undefined
    skip?: number | undefined
    render?: (filename?: string[] | undefined) => React.Component
    onFileClick?: (
        filename?: string,
        e?: React.MouseEvent<HTMLLIElement, MouseEvent> | undefined
    ) => void
}
interface FileListState {
    error?: any
    files?: string[]
}
export const FileList: React.FC<FileListProps> = (props) => {
    const clients = useAmphoraClients()
    const [state, setState] = React.useState<FileListState>({})
    React.useEffect(() => {
        if (clients.isAuthenticated) {
            clients.amphoraeApi
                .amphoraeFilesListFiles(
                    props.amphoraId,
                    props.orderBy,
                    props.prefix,
                    props.take,
                    props.skip
                )
                .then((r) => setState({ files: r.data }))
                .catch((error) => setState({ error }))
        }
    }, [clients.isAuthenticated])

    const handleClick = (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        file: string
    ) => {
        if (props.onFileClick) {
            props.onFileClick(file, e)
        }
    }

    const render = (filenames?: string[]) => {
        if (filenames && filenames.length > 0) {
            if (props.render) {
                return props.render(filenames)
            } else {
                return (
                    <ul>
                        {filenames.map((f) => (
                            <li key={f} onClick={(e) => handleClick(e, f)}>
                                {f}
                            </li>
                        ))}
                    </ul>
                )
            }
        } else {
            return <React.Fragment>No files.</React.Fragment>
        }
    }

    if (state.error) {
        return (
            <React.Fragment>An Error Occurred. `${state.error}`</React.Fragment>
        )
    } else {
        return <React.Fragment>{render(state.files)}</React.Fragment>
    }
}
