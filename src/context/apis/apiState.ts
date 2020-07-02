export interface ApiState {
    isAuthenticated: boolean
    isLoading?: boolean
    error?: any
}

export interface AuthenticateAction {
    type: 'isAuthenticated'
    payload: {
        value: boolean
    }
}
