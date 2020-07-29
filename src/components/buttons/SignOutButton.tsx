import * as React from 'react'
import { useIdentityState } from '../../context/IdentityContext'
// eslint-disable-next-line no-unused-vars
import { ButtonProps } from './props'
import styled from 'styled-components'

const ButtonDiv = styled.div`
    min-width: 7em;
    min-height: 1em;
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

const SignOutButton: React.FunctionComponent<ButtonProps> = (props) => {
    const context = useIdentityState()
    const signOut = (): void => {
        context.userManager && context.userManager.signoutRedirect()
    }
    if (context.user) {
        // user is already signed in
        return (
            <ButtonDiv style={props.style} onClick={(): void => signOut()}>
                {props.children || 'Sign Out'}
            </ButtonDiv>
        )
    } else if (props.alwaysOn) {
        return <ButtonDiv style={props.style}>{props.children || 'Signed Out'}</ButtonDiv>
    } else {
        return <React.Fragment />
    }
}

export { SignOutButton }
