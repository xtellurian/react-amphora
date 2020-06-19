import { createUserManager } from 'react-amphora'

const userManager = createUserManager({
    clientId: '9dffa207-6e61-4f9c-8c14-b37c4fb81bb0',
    redirectUri: 'http://localhost:3000/#/callback',
})

export { userManager }
