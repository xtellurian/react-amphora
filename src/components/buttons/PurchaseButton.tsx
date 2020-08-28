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
    const clients = useAmphoraClients()
    const purchase = (amphoraId: string) => {
        clients.amphoraeApi
            .purchasesPurchase(amphoraId)
            .then((r) => {
                console.log(r.data)
                if (props.onPurchased) {
                    props.onPurchased(amphoraId)
                }
            })
            .catch((e) => {
                if (props.onError) {
                    props.onError(e)
                }
            })
    }

    if (props.hasPurchaseScope) {
        const message = props.details
            ? `Get access for $${props.details.price}`
            : ' Get Access'
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
                    {props.children || 'Purchase Amphora'}
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
        if (clients.isAuthenticated) {
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
    }, [props.amphoraId, clients.isAuthenticated, clients.amphoraeApi])

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
                            loading: false,
                            hasAccess:
                                r.data.accessResponses[0].isAuthorized || false
                        })
                    } else {
                        setState({ loading: false, hasAccess: false })
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
            <ActualButton {...props} hasPurchaseScope={hasPurchaseScope}>
                {props.children}
            </ActualButton>
        )
    }
}
