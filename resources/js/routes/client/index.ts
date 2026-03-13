import cart from './cart'
import reservations from './reservations'
import client from './client'

const clientNamespace = {
    cart: Object.assign(cart, cart),
    reservations: Object.assign(reservations, reservations),
    client: Object.assign(client, client),
}

export default clientNamespace