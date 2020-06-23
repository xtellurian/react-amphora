import * as React from 'react'
import { useIdentityState } from '../context/IdentityContext'

export const UserInformationComponent = () => {
    const context = useIdentityState()
    if (context.user) {
        return (
            <div>
                <h4>Amphora User Information Panel</h4>
                <hr />
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
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
                                <td>
                                    {context.user.profile.email || 'Unknown'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    } else {
        return <div>You are not logged in with Amphora.</div>
    }
}
