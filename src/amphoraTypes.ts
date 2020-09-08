/* eslint-disable no-unused-vars */
import {
    TermsOfUse,
    BasicAmphora,
    FuzzySearchResponse,
    SearchResponseOfBasicAmphora
} from 'amphoradata'

export type AmphoraServerResponseTypes =
    | string // when an Amphora is deleted, the response is a string....?
    | BasicAmphora
    | BasicAmphora[]
    | FuzzySearchResponse
    | TermsOfUse
    | TermsOfUse[]
    | SearchResponseOfBasicAmphora
