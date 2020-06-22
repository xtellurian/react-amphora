import { createUserManager } from 'react-amphora'

export const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
)

let redirectUri =
    'https://react-amphora-example.xtellurian.vercel.app/#/callback'

if (isLocalhost) {
    redirectUri = 'http://localhost:3000/#/callback'
}

const userManager = createUserManager({
    clientId: 'b022d07e-5867-48b5-99ff-d48d92c774a2',
    redirectUri
})

export { userManager }
