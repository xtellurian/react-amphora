import * as React from 'react'
import { useAuthState } from '../context/AmphoraAuthContext'

export const UserInformationComponent = () => {
    const context = useAuthState()
    if (context.user) {
        return (
            <div>
                <h4>Amphora User Information Panel</h4>
                <hr />
                <div>
                    <table>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                        </tr>
                        <tr>
                            <td>Username</td>
                            <td>{context.user.profile.name}</td>
                        </tr>
                        <tr>
                            <td>Subject Id</td>
                            <td>{context.user.profile.sub}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{context.user.profile.email || 'Unknown'}</td>
                        </tr>
                    </table>
                </div>
            </div>
        )
    } else {
        return <div>You are not logged in with Amphora.</div>
    }
}
