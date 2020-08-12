import * as React from 'react'
import { dracula, CodeBlock } from 'react-code-blocks'
import { Row, Col } from 'reactstrap'
import { EnsurePurchased } from 'react-amphora'

const notBoughtThis = '12b3f8bb-2eb6-47b4-86b2-25fba18ab368'
const ensurePurchasedCode = `import { EnsurePurchased } from 'react-amphora'

<EnsurePurchased
    defaultCanReadContents={false}
    amphoraId="12b3f8bb-2eb6-47b4-86b2-25fba18ab368"
>
<span>You won't see this unless you have purchased the Amphora</span>
</EnsurePurchased>

`

export const UtilityGallery: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <h2>React-Amphora Utilities</h2>
            <hr />
            <Row>
                <Col>
                    <h3>Ensure Purchased Wrapper</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CodeBlock
                        text={ensurePurchasedCode}
                        language='jsx'
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </Col>
                <Col>
                    <EnsurePurchased
                        defaultCanReadContents={false}
                        amphoraId={notBoughtThis}
                    >
                        <span>
                            You won't see this unless you have purchased the
                            Amphora
                        </span>
                    </EnsurePurchased>
                    <p>
                        Use this wrapper to allow users to purchase or get
                        access to data before attempting to render or display
                        data. It renders the PurchaseButton component by
                        default.
                    </p>
                    <p>
                        If the user has consented to allow your application to
                        purchase on their behalf, the purchase will happen
                        automatically. If consent was not granted, then the
                        button will link to the Amphora Data app.
                    </p>
                </Col>
            </Row>
            <hr />
        </React.Fragment>
    )
}
