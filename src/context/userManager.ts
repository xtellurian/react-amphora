// eslint-disable-next-line no-unused-vars
import { UserManagerSettings, UserManager } from 'oidc-client'

export interface OAuthConfig {
    authority?: string
    clientId: string
    redirectUri: string
    scope?: string
    silentRedirectUri?: string
}

function getSettings(config: OAuthConfig): UserManagerSettings {
    return {
        authority: config.authority || 'https://identity.amphoradata.com',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        silent_redirect_uri: config.silentRedirectUri,
        scope: config.scope || 'openid web_api',
        automaticSilentRenew: !config.silentRedirectUri
    }
}

export function getUserManager(config: OAuthConfig): UserManager {
    const settings = getSettings(config)
    return new UserManager(settings)
}
