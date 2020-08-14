import * as React from 'react'
import { dracula, CodeBlock } from 'react-code-blocks'
import { FileList, EnsurePurchased, FileRenderer } from 'react-amphora'
import { Row, Col } from 'reactstrap'

const fileListCode = `<FileList
    onFileClick={(n) => alert(n)}
    amphoraId='d225c442-0347-4f90-88d2-ce1459f88086'
/>

`
const fileTextRenderCode = `<FileRenderer
    amphoraId='4c036cda-0035-409d-b515-15dbcc8ff364'
    file='CSIRO_Soil_Model_Data_Description.txt'
    mimeType='text/plain'
    />

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
                        <FileList
                            onFileClick={(n) => alert(n)}
                            amphoraId='d225c442-0347-4f90-88d2-ce1459f88086'
                        />
                    </EnsurePurchased>
                </Col>
            </Row>

            <hr />
            <Row>
                <Col>
                    <h3>File Renderer</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CodeBlock
                        text={fileTextRenderCode}
                        language='jsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </Col>
                <Col>
                    <EnsurePurchased amphoraId='d225c442-0347-4f90-88d2-ce1459f88086'>
                        <FileRenderer
                            amphoraId='4c036cda-0035-409d-b515-15dbcc8ff364'
                            file='CSIRO_Soil_Model_Data_Description.txt'
                            mimeType='text/plain'
                        />
                    </EnsurePurchased>
                    <hr />
                    <div>
                        Supported mime types:
                        <ul>
                            <li>text/plain</li>
                        </ul>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}
