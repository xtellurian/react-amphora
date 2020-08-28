// eslint-disable-next-line no-unused-vars
import { DetailedAmphora } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState, AuthenticateAction } from '../apiState'
// eslint-disable-next-line no-unused-vars
import { FetchMyAmphora } from '../../actions'
import {
    MyAmphoraApiProvider,
    useMyAmphora,
    useMyAmphoraState,
    useMyAmphoraDispatch,
    withMyAmphora,
    withMyAmphoraState,
    withFetchMyAmphoraDispatch
} from './MyAmphoraContext'

const SELF_SCOPE = 'self'
const ORG_SCOPE = 'organisation'
const ACCESS_TYPE_CREATED = 'created'
const ACCESS_TYPE_PURCHASED = 'purchased'

export type Scope = typeof SELF_SCOPE | typeof ORG_SCOPE
export type AccessType =
    | typeof ACCESS_TYPE_CREATED
    | typeof ACCESS_TYPE_PURCHASED

export type FetchMyAmphoraDispatch = {
    dispatch: (action: FetchMyAmphora | AuthenticateAction) => void
}

export interface MyAmphoraState extends ApiState {
    scope?: Scope
    accessType?: AccessType
    results: DetailedAmphora[]
    // and the specific scopes
    selfCreatedResults: DetailedAmphora[]
    isSelfCreatedLoading: boolean
    selfPurchasedResults: DetailedAmphora[]
    isSelfPurchasedLoading: boolean
    organisationCreatedResults: DetailedAmphora[]
    isOrganisationCreatedLoading: boolean
    organisationPurchasedResults: DetailedAmphora[]
    isOrganisationPurchasedLoading: boolean
}
export {
    MyAmphoraApiProvider,
    useMyAmphora,
    useMyAmphoraState,
    useMyAmphoraDispatch,
    withMyAmphora,
    withMyAmphoraState,
    withFetchMyAmphoraDispatch
}
