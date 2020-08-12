import * as React from 'react'
import useAsyncReducer from '../../utility/useAsyncReducer'
import { useAmphoraClients } from '../../context/ApiClientContext'
// eslint-disable-next-line no-unused-vars
import { PermissionsResponse } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState } from '../../context/apis/apiState'
import { PurchaseButton } from '../buttons/PurchaseButton'

interface EnsurePurchasedProps {
    amphoraId: string
    defaultCanReadContents?: boolean | null | undefined
    defaultCanPurchase?: boolean | null | undefined
}
interface EnsurePurchasedState extends ApiState {
    response?: PermissionsResponse | undefined
    canReadContents: boolean
    canPurchase: boolean
}
interface EnsurePurchasedAction {
    type: 'FetchPermissions'
    payload: {
        amphoraId: string
    }
}
const levels = {
    purchase: 24,
    readContents: 32
}

const canReadContents = (
    amphoraId: string,
    r?: PermissionsResponse
): boolean => {
    if (r && r.accessResponses) {
        const readContentsResponse = r.accessResponses.find(
            (a) =>
                a.amphoraId === amphoraId &&
                a.accessLevel === levels.readContents
        )
        return readContentsResponse?.isAuthorized || false
    }
    return true
}

const canPurchase = (amphoraId: string, r?: PermissionsResponse): boolean => {
    if (r && r.accessResponses) {
        const readContentsResponse = r.accessResponses.find(
            (a) =>
                a.amphoraId === amphoraId && a.accessLevel === levels.purchase
        )
        return readContentsResponse?.isAuthorized || false
    }
    return true
}

export const EnsurePurchased: React.FC<EnsurePurchasedProps> = ({
    amphoraId,
    children,
    defaultCanPurchase,
    defaultCanReadContents
}) => {
    const clients = useAmphoraClients()

    const asyncReducer = async (
        state: EnsurePurchasedState | null,
        action: EnsurePurchasedAction
    ): Promise<EnsurePurchasedState> => {
        if (action) {
            const res = await clients.permissionApi.permissionGetPermissions({
                accessQueries: [
                    {
                        amphoraId: action.payload.amphoraId,
                        accessLevel: levels.purchase
                    },
                    {
                        amphoraId: action.payload.amphoraId,
                        accessLevel: levels.readContents
                    }
                ]
            })

            return {
                isAuthenticated: clients.isAuthenticated,
                response: res.data,
                canPurchase: canPurchase(amphoraId, res.data),
                canReadContents: canReadContents(amphoraId, res.data)
            }
        } else {
            return (
                state || {
                    canReadContents: defaultCanReadContents || false,
                    canPurchase: defaultCanPurchase || true,
                    isAuthenticated: clients.isAuthenticated
                }
            )
        }
    }

    const [state, dispatch] = useAsyncReducer<
        EnsurePurchasedState,
        EnsurePurchasedAction
    >(asyncReducer, {
        isAuthenticated: clients.isAuthenticated,
        canReadContents: defaultCanReadContents || false,
        canPurchase: defaultCanPurchase || true
    })

    React.useEffect(() => {
        if (clients.isAuthenticated) {
            dispatch({ type: 'FetchPermissions', payload: { amphoraId } })
        }
    }, [clients.isAuthenticated])

    const handlePurchasedEvent = (amphoraId: string) => {
        dispatch({ type: 'FetchPermissions', payload: { amphoraId } })
    }

    if (!state.isAuthenticated) {
        return <React.Fragment>Sign in with Amphora to view</React.Fragment>
    } else if (state.canReadContents) {
        return <React.Fragment>{children}</React.Fragment>
    } else if (state.isLoading) {
        return <React.Fragment>Ensuring Access...</React.Fragment>
    } else {
        return (
            <React.Fragment>
                <PurchaseButton
                    onPurchased={handlePurchasedEvent}
                    amphoraId={amphoraId}
                />
            </React.Fragment>
        )
    }
}
