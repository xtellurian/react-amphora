import * as React from 'react'
import {
    AmphoraProvider,
    useCountDispatch,
    useCountState
} from './context/AmphoraContext'
import styles from './styles.module.css'

interface Props {
    text: string
}

export const ExampleComponent = ({ text }: Props) => {
    return <div className={styles.test}>Example Component: {text}</div>
}

export { AmphoraProvider, useCountDispatch, useCountState }
