import * as React from 'react'
import { useIdentityState } from '../../context/IdentityContext'
// eslint-disable-next-line no-unused-vars
import { ButtonProps } from './props'
import styled from 'styled-components'

const ButtonDiv = styled.div`
    padding: 0.5rem;
    border: 1px solid #5aa6c0;
    box-shadow: 0px 0px 0px 2px #5aa6c0;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colors.main};
    color: #fffefd;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.colors.highlight};
    }
`

const SignInButton: React.FunctionComponent<ButtonProps> = (props) => {
    const context = useIdentityState()
    const signIn = (): void => {
        context.userManager &&
            context.userManager.signinRedirect({ data: { path: '/' } })
    }
    if (!context.user || context.user.expired) {
        // can sign in
        return (
            <ButtonDiv style={props.style} onClick={(): void => signIn()}>
                {props.children || 'Sign In with Amphora'}
            </ButtonDiv>
        )
    } else if (props.alwaysOn) {
        return (
            <ButtonDiv style={props.style}>
                Hello {context.user && context.user.profile.name}!
            </ButtonDiv>
        )
    } else {
        return <React.Fragment />
    }
}

export { SignInButton }
