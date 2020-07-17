import * as React from 'react'
import { CopyBlock, dracula } from "react-code-blocks"
import {SignInButton} from 'react-amphora'
const text = `<SignInButton />`

export const SignInButtonExample: React.FunctionComponent = () => {
    return (<React.Fragment>
        <CopyBlock text={text} language="typescript" theme={dracula}/>
        <hr/>
        <SignInButton />
    </React.Fragment>)
}