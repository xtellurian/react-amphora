// eslint-disable-next-line no-unused-vars
import { DefaultTheme } from 'styled-components'

// this should match the theme interface in styled-components/index.d.ts
export interface AmphoraTheme extends DefaultTheme {
    colors: {
        main: string
        secondary: string
        highlight: string
    }
}

export const defaultTheme: AmphoraTheme = {
    colors: {
        main: '#0a789e',
        secondary: '#BC312A',
        highlight: '#5aa6c0'
    }
}
