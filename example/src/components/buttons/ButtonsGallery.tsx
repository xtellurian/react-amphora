import * as React from 'react'
import { dracula, CodeBlock } from 'react-code-blocks'
import { SignInButton, SignOutButton, PurchaseButton } from 'react-amphora'
import { Row, Col } from 'reactstrap'
const signInButtonCode = `<SignInButton alwaysOn={true} />

`
const signOutButtonCode = `<SignOutButton alwaysOn={true} />

`
const styledButtonCode = `
<SignInButton
    alwaysOn={true}
    style={{
        backgroundColor: 'purple',
        width: '50%',
        margin: 'auto'
    }}
>
    <span>Custom Children are allowed</span>
</SignInButton>

`

const purchaseButtonCode = `<PurchaseButton 
    amphoraId='9ceff620-cbc8-4b60-9db3-8f6aad0a3630' />

`

export const ButtonsGallery: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <h2>React-Amphora Buttons</h2>
            <hr />
            <Row>
                <Col>
                    <h3>Sign In Button</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CodeBlock
                        text={signInButtonCode}
                        language='jsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </Col>
                <Col>
                    <SignInButton alwaysOn={true} />
                </Col>
            </Row>

            <hr />
            <Row>
                <Col>
                    <h3>Sign Out Button</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CodeBlock
                        text={signOutButtonCode}
                        language='jsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </Col>
                <Col>
                    <SignOutButton alwaysOn={true} />
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
                        language='jsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </Col>
                <Col>
                    <SignInButton
                        alwaysOn={true}
                        style={{
                            backgroundColor: 'purple',
                            width: '50%',
                            margin: 'auto'
                        }}
                    >
                        <span>Custom Children</span>
                    </SignInButton>
                </Col>
            </Row>

            <hr />
            <Row>
                <Col>
                    <h3>Purchase Button</h3>
                </Col>
            </Row>

            <Row>
                <Col className='justify-content-center'>
                    <CodeBlock
                        text={purchaseButtonCode}
                        language='jsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </Col>
                <Col>
                    <PurchaseButton amphoraId='9ceff620-cbc8-4b60-9db3-8f6aad0a3630' />
                </Col>
            </Row>
        </React.Fragment>
    )
}
