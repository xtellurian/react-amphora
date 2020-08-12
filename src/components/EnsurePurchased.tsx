import * as React from 'react'
import useAsyncReducer from '../utlility/useAsyncReducer'
import { useAmphoraClients } from '../context/ApiClientContext'
// eslint-disable-next-line no-unused-vars
import { PermissionsResponse } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState } from '../context/apis/apiState'

interface EnsurePurchasedProps {
    amphoraId: string
}
interface EnsurePurchasedState extends ApiState {
    response?: PermissionsResponse | undefined
    canReadContents: boolean
    canPurchase: boolean
}
interface EnsurePurchasedAction {
    response?: PermissionsResponse | undefined
}
const levels = {
    purchase: 24,
    readContents: 32
}

const canReadContents = (
    amphoraId: string,
    r?: PermissionsResponse
): boolean => {
    if (r) {
        const readContentsResponse = r.accessResponses.find(
            (a) =>
                a.amphoraId === amphoraId &&
                a.accessLevel === levels.readContents
        )
        return readContentsResponse.isAuthorized || false
    }
    return true
}

const canPurchase = (amphoraId: string, r?: PermissionsResponse): boolean => {
    if (r) {
        const readContentsResponse = r.accessResponses.find(
            (a) =>
                a.amphoraId === amphoraId && a.accessLevel === levels.purchase
        )
        return readContentsResponse.isAuthorized || false
    }
    return true
}

export const EnsurePurchased: React.FC<EnsurePurchasedProps> = ({
    amphoraId,
    children
}) => {
    const clients = useAmphoraClients()

    const asyncReducer = async (
        state: EnsurePurchasedState,
        action: EnsurePurchasedAction
    ): Promise<EnsurePurchasedState> => {
        const res = await clients.permissionApi.permissionGetPermissions({
            accessQueries: [
                { amphoraId, accessLevel: levels.purchase },
                { amphoraId, accessLevel: levels.readContents }
            ]
        })

        return {
            isAuthenticated: clients.isAuthenticated,
            response: res.data,
            canPurchase: canPurchase(amphoraId, res.data),
            canReadContents: canReadContents(amphoraId, res.data)
        }
    }

    const [state, dispatch] = useAsyncReducer<
        EnsurePurchasedState,
        EnsurePurchasedAction
    >(asyncReducer, {
        isAuthenticated: clients.isAuthenticated,
        canPurchase: true,
        canReadContents: true
    })

    dispatch({})

    if (state.canReadContents) {
        return <React.Fragment>{children}</React.Fragment>
    } else {
        return (
            <React.Fragment>YOU NEED TO PURCHASE THIS AMPHORA</React.Fragment>
        )
    }
}
