import * as React from 'react'
import { dracula, CodeBlock } from 'react-code-blocks'
import { SignInButton } from 'react-amphora'
import { Row, Col } from 'reactstrap'
const basicCode = `<SignInButton />

`
const styledButtonCode = `<SignInButton style={{ backgroundColor: 'purple' }}/>

`

export const ButtonsExample: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <h2>React-Amphora Buttons</h2>
            <hr />
            <Row>
                <Col>
                    <h3>Standard Sign In Button</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CodeBlock
                        text={basicCode}
                        language='tsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </Col>
                <Col>
                    <SignInButton />
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    <h3>Styled Button</h3>
                </Col>
            </Row>
            <Row>
                <Col className='justify-content-center'>
                    <CodeBlock
                        text={styledButtonCode}
                        language='tsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </Col>
                <Col>
                    <SignInButton style={{ backgroundColor: 'purple' }} />
                </Col>
            </Row>
        </React.Fragment>
    )
}
