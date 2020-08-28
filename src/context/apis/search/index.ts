// eslint-disable-next-line no-unused-vars
import { ApiState } from '../apiState'
// eslint-disable-next-line no-unused-vars
import { BasicAmphora } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import * as Actions from '../../actions'
import {
    SearchApiProvider,
    useSearchState,
    useSearchDispatch,
    withSearch,
    withSearchState,
    withSearchDispatch
} from './SearchContext'
export interface SearchState extends ApiState {
    results: BasicAmphora[]
}

export type AllSearchActions = Actions.Search

export type SearchDispatch = { dispatch: (action: AllSearchActions) => void }
export {
    SearchApiProvider,
    useSearchState,
    useSearchDispatch,
    withSearch,
    withSearchState,
    withSearchDispatch
}
