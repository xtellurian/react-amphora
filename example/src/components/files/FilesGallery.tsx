import * as React from 'react'
import { dracula, CodeBlock } from 'react-code-blocks'
import { FileList, EnsurePurchased } from 'react-amphora'
import { Row, Col } from 'reactstrap'

const fileListCode = `<FileList amphoraId="d225c442-0347-4f90-88d2-ce1459f88086" />

`

export const FilesGallery: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <h2>React-Amphora Files Components</h2>
            <hr />
            <Row>
                <Col>
                    <h3>File List</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CodeBlock
                        text={fileListCode}
                        language='jsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </Col>
                <Col>
                    <EnsurePurchased amphoraId='d225c442-0347-4f90-88d2-ce1459f88086'>
                        <FileList amphoraId='d225c442-0347-4f90-88d2-ce1459f88086' />
                    </EnsurePurchased>
                </Col>
            </Row>
        </React.Fragment>
    )
}
