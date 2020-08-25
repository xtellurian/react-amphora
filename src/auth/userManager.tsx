// eslint-disable-next-line no-unused-vars
import { UserManagerSettings, UserManager } from 'oidc-client'

type Scope =
    | 'openid'
    | 'profile'
    | 'web_api'
    | 'amphora.purchase'
    | 'amphora'
    | 'offline_access'

export interface OAuthConfig extends UserManagerSettings {
    authority?: string
    clientId: string
    redirectUri: string
    scopes?: Scope[]
    silentRedirectUri?: string
}

function getSettings(config: OAuthConfig): UserManagerSettings {
    return {
        ...config,
        authority: config.authority || 'https://identity.amphoradata.com',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        silent_redirect_uri: config.silentRedirectUri,
        scope: config.scopes ? config.scopes.join(' ') : 'openid profile',
        response_type: 'code'
    }
}

export const createUserManager = (config: OAuthConfig): UserManager => {
    const settings = getSettings(config)
    return new UserManager(settings)
}
