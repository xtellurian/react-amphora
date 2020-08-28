import * as React from 'react'
import { useAmphoraClients } from '../../context/ApiClientContext'
import { useIdentityState } from '../../context/IdentityContext'
import accessLevels from '../../constants/accessLevels'
// eslint-disable-next-line no-unused-vars
import { DetailedAmphora } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ButtonProps } from './props'
import { StyledButtonDiv } from './StyledButtonDiv'

const purchaseScope = 'amphora.purchase'

interface PurchaseButtonProps extends ButtonProps {
    amphoraId: string
    onPurchased?: (amphoraId: string) => void
    onError?: (error: any) => void
}
interface PurchaseButtonState {
    loading: boolean
    hasAccess: boolean
    details?: DetailedAmphora
}

interface ActualButtonProps extends PurchaseButtonProps {
    hasPurchaseScope: boolean
    amphoraId: string
    details?: DetailedAmphora
}

const ActualButton: React.FC<ActualButtonProps> = (props) => {
    const [price, setPrice] = React.useState<number>()
    const clients = useAmphoraClients()
    const purchase = (amphoraId: string) => {
        clients.amphoraeApi
            .purchasesPurchase(amphoraId)
            .then((r) => {
                if (props.onPurchased) {
                    props.onPurchased(amphoraId)
                }
                console.log(r.data.message)
            })
            .catch((e) => {
                if (props.onError) {
                    props.onError(e)
                }
            })
    }
    React.useEffect(() => {
        if (props.details) {
            setPrice(props.details.price)
        }
    }, [props.details])

    const message = price ? `Get access for $${price}` : ' Get Access'
    if (props.hasPurchaseScope) {
        return (
            <StyledButtonDiv
                style={props.style}
                onClick={(): void => purchase(props.amphoraId)}
            >
                {props.children || message}
            </StyledButtonDiv>
        )
    } else {
        return (
            <a
                target='_blank'
                rel='noreferrer'
                href={`https://app.amphoradata.com/amphorae/detail?id=${props.amphoraId}`}
            >
                <StyledButtonDiv style={props.style}>
                    {props.children || message}
                </StyledButtonDiv>
            </a>
        )
    }
}
export const PurchaseButton: React.FC<PurchaseButtonProps> = (props) => {
    const clients = useAmphoraClients()
    const idState = useIdentityState()
    const [state, setState] = React.useState<PurchaseButtonState>({
        loading: true,
        hasAccess: false
    })
    const userHasScope = () =>
        !!idState.user && idState.user.scopes.includes(purchaseScope)

    const [hasPurchaseScope, setHasPurchaseScope] = React.useState(
        userHasScope()
    )

    React.useEffect(() => {
        setHasPurchaseScope(userHasScope())
    }, [idState.user])

    // get amphora details
    React.useEffect(() => {
        if (clients.isAuthenticated && !state.hasAccess) {
            clients.amphoraeApi
                .amphoraeRead(props.amphoraId)
                .then((r) => {
                    setState({
                        loading: state.loading,
                        hasAccess: state.loading,
                        details: r.data
                    })
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [props.amphoraId, clients.isAuthenticated, state.hasAccess])

    React.useEffect(() => {
        if (clients.isAuthenticated) {
            clients.permissionApi
                .permissionGetPermissions({
                    accessQueries: [
                        {
                            amphoraId: props.amphoraId,
                            accessLevel: accessLevels.readContents
                        }
                    ]
                })
                .then((r) => {
                    if (
                        r.data.accessResponses &&
                        r.data.accessResponses.length > 0
                    ) {
                        setState({
                            details: state.details,
                            loading: false,
                            hasAccess:
                                r.data.accessResponses[0].isAuthorized || false
                        })
                    } else {
                        setState({
                            loading: false,
                            hasAccess: false,
                            details: state.details
                        })
                    }
                })
        }
    }, [props.amphoraId, clients.isAuthenticated, clients.permissionApi])
    if (state.loading) {
        return <div>Loading...</div>
    } else if (state.hasAccess) {
        return <div>You have access to this Amphora.</div>
    } else {
        return (
            <ActualButton
                {...props}
                hasPurchaseScope={hasPurchaseScope}
                details={state.details}
            >
                {props.children}
            </ActualButton>
        )
    }
}
