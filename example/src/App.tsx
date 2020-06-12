import React from 'react'

import { ExampleComponent, AmphoraProvider, useCountDispatch, useCountState } from 'react-amphora'
import 'react-amphora/dist/index.css'

const Dispatcher = () => {
  const dispatch = useCountDispatch()
  return (
    <React.Fragment>
      <button onClick={() => dispatch({type: "increment"})}> 
        INcrement
      </button>
      <button onClick={() => dispatch({type: "decrement"})}> 
        Decriment
      </button>
    </React.Fragment>
  )
}
const Display = () => {
  const state = useCountState()
  return (
    <React.Fragment>
      COUNT: {state.count}
    </React.Fragment>
  )
}
const App = () => {

  return (
    <React.Fragment>
      <AmphoraProvider>
        <Dispatcher />
        <Display/>
        </AmphoraProvider>
      <ExampleComponent text="Create React Library Example 😄" />)
      
    </React.Fragment>)
}

export default App
