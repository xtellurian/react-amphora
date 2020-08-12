import * as React from 'react'
import { useIdentityState } from '../../context/IdentityContext'
// eslint-disable-next-line no-unused-vars
import { ButtonProps } from './props'
import { StyledButtonDiv } from './StyledButtonDiv'

const SignOutButton: React.FunctionComponent<ButtonProps> = (props) => {
    const context = useIdentityState()
    const signOut = (): void => {
        context.userManager && context.userManager.signoutRedirect()
    }
    if (context.user && !context.user.expired) {
        // user is already signed in
        return (
            <StyledButtonDiv
                style={props.style}
                onClick={(): void => signOut()}
            >
                {props.children || 'Sign Out'}
            </StyledButtonDiv>
        )
    } else if (props.alwaysOn) {
        return (
            <StyledButtonDiv style={props.style}>
                {props.children || 'Signed Out'}
            </StyledButtonDiv>
        )
    } else {
        return <React.Fragment />
    }
}

export { SignOutButton }
