import { createUserManager } from 'react-amphora'

const userManager = createUserManager({
    clientId: 'react-amphora',
    redirectUri: 'http://localhost:3000/#/callback',
    authority: 'http://localhost:6500'
})

export { userManager }
