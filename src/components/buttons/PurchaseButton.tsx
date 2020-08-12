import * as React from 'react'
import { useAmphoraClients } from '../../context/ApiClientContext'
import { useIdentityState } from '../../context/IdentityContext'
// eslint-disable-next-line no-unused-vars
import { ButtonProps } from './props'
import { StyledButtonDiv } from './StyledButtonDiv'

const purchaseScope = 'amphora.purchase'

interface PurchaseButtonProps extends ButtonProps {
    amphoraId: string
    onPurchased?: (amphoraId: string) => void
    onError?: (error: any) => void
}
export const PurchaseButton: React.FC<PurchaseButtonProps> = (props) => {
    const clients = useAmphoraClients()
    const idState = useIdentityState()

    const userHasScope = () =>
        !!idState.user && idState.user.scopes.includes(purchaseScope)

    const [hasPurchaseScope, setHasPurchaseScope] = React.useState(
        userHasScope()
    )

    React.useEffect(() => {
        setHasPurchaseScope(userHasScope())
    }, [idState.user])

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
    if (hasPurchaseScope) {
        return (
            <StyledButtonDiv
                style={props.style}
                onClick={(): void => purchase(props.amphoraId)}
            >
                {props.children || 'Purchase Amphora'}
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
