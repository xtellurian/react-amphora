import * as React from 'react'

const styles: React.CSSProperties = {
    margin: '1em',
    padding: '1em'
}
const Information = () => {
    return (
        <div style={styles}>
            <h1>React-Amphora</h1>
            <a href='https://github.com/xtellurian/react-amphora'>
                Find the source code here
            </a>
            <hr />
            React-Amphora is a react component library for{' '}
            <a href='https:/www.amphoradata.com'>Amphora Data</a>.
            <br/>
            <strong>react-amphora</strong>
            <ul>
                <li>
                    Is built with modern React
                </li>
                <li>
                    Uses the <a href="https://reactjs.org/docs/context.html">React Context APIs</a>
                </li>
                <li>
                    Is a part of the Amphora Identity System
                </li>
            </ul>
        </div>
    )
}

export default Information
