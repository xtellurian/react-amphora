import {
    IdentityContextProvider,
    useIdentityDispatch,
    useIdentityState
} from './context/IdentityContext'
import {
    CallbackPage,
    UserInformationComponent,
    SignInButton,
    SignOutButton,
    createUserManager
} from './auth'
import {
    withSearch,
    withSearchState,
    withSearchDispatch,
    SearchState,
    SearchDispatch
} from './context/api/SearchContext'
import { AmphoraProvider } from './context/Provider'
import { useApiState, withConfiguration } from './context/ConfigurationContext'

export {
    AmphoraProvider,
    withConfiguration,
    IdentityContextProvider,
    useIdentityDispatch,
    useIdentityState,
    CallbackPage,
    UserInformationComponent,
    SignInButton,
    SignOutButton,
    createUserManager,
    useApiState,
    withSearch,
    withSearchState,
    withSearchDispatch,
    SearchState,
    SearchDispatch
}
