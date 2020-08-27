import * as React from 'react'
import { dracula, CodeBlock } from 'react-code-blocks'
import { FileList, EnsurePurchased, FileRenderer } from 'react-amphora'
import { Row, Col } from 'reactstrap'

const fileListCode = `<FileList
    onFileClick={(n) => alert(n)}
    amphoraId='d225c442-0347-4f90-88d2-ce1459f88086'
/>

`
const textFileRenderCode = `<FileRenderer
    amphoraId='4c036cda-0035-409d-b515-15dbcc8ff364'
    file='CSIRO_Soil_Model_Data_Description.txt'
    mimeType='text/plain'
    />

`

const imageFileRenderCode = `<FileRenderer
    amphoraId='555c1512-790a-4a25-ae7b-5b8a2f7d6656'
    file='101.png'
    mimeType='image/png'
    // mimeType optional, and can also be read from the ContentType attribute. 
    // See https://www.amphoradata.com/docs/files/attributes
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
                    <h4>Text Files</h4>
                    <CodeBlock
                        text={textFileRenderCode}
                        language='jsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                    <h4>Image Files</h4>
                    <CodeBlock
                        text={imageFileRenderCode}
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
                    <p>Supported mime types:</p>
                    <ul>
                        <li>text/plain</li>
                    </ul>

                    <hr />
                    <EnsurePurchased amphoraId='555c1512-790a-4a25-ae7b-5b8a2f7d6656'>
                        <FileRenderer
                            amphoraId='555c1512-790a-4a25-ae7b-5b8a2f7d6656'
                            file='101.png'
                        />
                    </EnsurePurchased>
                    <p>Supported mime types:</p>
                    <ul>
                        <li>image/jpeg</li>
                        <li>image/png</li>
                    </ul>
                </Col>
            </Row>
        </React.Fragment>
    )
}
