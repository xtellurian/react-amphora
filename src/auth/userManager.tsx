// eslint-disable-next-line no-unused-vars
import { UserManagerSettings, UserManager } from 'oidc-client'

type Scope =
    | 'openid'
    | 'profile'
    | 'web_api'
    | 'amphora.purchase'
    | 'amphora'
    | 'offline_access'

export interface OAuthConfig {
    authority?: string
    clientId: string
    redirectUri: string
    scopes?: Scope[]
    silentRedirectUri?: string
    automaticSilentRenew?: boolean
    filterProtocolClaims?: boolean
    loadUserInfo?: boolean
    monitorSession?: boolean
}

function getSettings(config: OAuthConfig): UserManagerSettings {
    return {
        authority: config.authority || 'https://identity.amphoradata.com',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        silent_redirect_uri: config.silentRedirectUri,
        scope: config.scopes ? config.scopes.join(' ') : 'openid profile',
        response_type: 'code',
        automaticSilentRenew: config.automaticSilentRenew,
        filterProtocolClaims: config.filterProtocolClaims,
        loadUserInfo: config.loadUserInfo,
        monitorSession: config.monitorSession
    }
}

export const createUserManager = (config: OAuthConfig): UserManager => {
    const settings = getSettings(config)
    return new UserManager(settings)
}
