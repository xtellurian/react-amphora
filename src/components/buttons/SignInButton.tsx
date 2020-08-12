import * as React from 'react'
import { useIdentityState } from '../../context/IdentityContext'
// eslint-disable-next-line no-unused-vars
import { ButtonProps } from './props'
import { StyledButtonDiv } from './StyledButtonDiv'

const SignInButton: React.FunctionComponent<ButtonProps> = (props) => {
    const context = useIdentityState()
    const signIn = (): void => {
        context.userManager &&
            context.userManager.signinRedirect({ data: { path: '/' } })
    }
    if (!context.user || context.user.expired) {
        // can sign in
        return (
            <StyledButtonDiv style={props.style} onClick={(): void => signIn()}>
                {props.children || 'Sign In with Amphora'}
            </StyledButtonDiv>
        )
    } else if (props.alwaysOn) {
        return (
            <StyledButtonDiv style={props.style}>
                {props.children ||
                    `Hello ${context.user && context.user.profile.name}!`}
            </StyledButtonDiv>
        )
    } else {
        return <React.Fragment />
    }
}

export { SignInButton }
