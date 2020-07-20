/* eslint-disable no-unused-vars */
import { User } from 'oidc-client'
import {
    TermsOfUse,
    EditAmphora as EditAmphoraModel,
    CreateAmphora as CreateAmphoraModel
} from 'amphoradata'
import { AxiosResponse } from 'axios'
import { AmphoraServerResponseTypes } from '../amphoraTypes'
import { Scope, AccessType } from './apis/MyAmphoraContext'

export interface Action {
    type: string
    payload?: any | null | undefined
}

export interface ActionResult extends Action {
    action: Action
    response: AxiosResponse<AmphoraServerResponseTypes>
}

// identity actions
export interface Login extends Action {
    type: 'authentication:login'
    payload: User
}
export interface Logout extends Action {
    type: 'authentication:logout'
}

// configuration actions
export interface SetAuthToken extends Action {
    type: 'authentication:set_token'
    payload: {
        token: string
    }
}
export interface ResetAuthToken extends Action {
    type: 'authentication:reset_token'
}

// my amphora actions
export interface FetchMyAmphora extends Action {
    type: 'my-amphora:fetch-list'
    payload: {
        scope?: Scope
        accessType?: AccessType
    }
}
// terms
export interface FetchTerms extends Action {
    type: 'terms:fetch-list'
}
export interface FetchSingleTerms extends Action {
    type: 'terms:fetch-single'
    payload: {
        id: string
    }
}
export interface CreateTerms extends Action {
    type: 'terms:create'
    payload: {
        model: TermsOfUse
    }
}

// search
export interface Search extends Action {
    type: 'search:execute'
    payload: {
        term?: string
    }
}

// geo
export interface GeoLookup extends Action {
    type: 'geo:lookup'
    payload: {
        query?: string
    }
}

// operations
export interface CreateAmphora extends Action {
    type: 'amphora-operation:create'
    payload: {
        model: CreateAmphoraModel
    }
}
export interface ReadAmphora extends Action {
    type: 'amphora-operation:read'
    payload: {
        id: string
    }
}
export interface UpdateAmphora extends Action {
    type: 'amphora-operation:update'
    payload: {
        id: string
        model: EditAmphoraModel
    }
}
export interface DeleteAmphora extends Action {
    type: 'amphora-operation:delete'
    payload: {
        id: string
    }
}