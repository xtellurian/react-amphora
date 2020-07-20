// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from 'axios'
// eslint-disable-next-line no-unused-vars
import { Action, ActionResult } from './actions'
export interface ContextProps {
    onAction?: ((action: Action, payload?: any) => void) | undefined
    onActionResult?: ((action: ActionResult, payload?: any) => void) | undefined
}

export const publish = (props: ContextProps, action: Action) => {
    if (props.onAction) {
        props.onAction(action)
    }
}
export const publishResult = (
    props: ContextProps,
    actionResult: ActionResult
) => {
    if (props.onActionResult) {
        props.onActionResult(actionResult)
    }
}

export const fromStatus = (action: Action, response: AxiosResponse): string =>
    `${action.type}:${response.status > 299 ? 'failed' : 'succeeded'}`
