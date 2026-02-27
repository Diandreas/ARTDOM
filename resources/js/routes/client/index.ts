import cart from './cart'
import reservations from './reservations'

const client = {
    cart: Object.assign(cart, cart),
    reservations: Object.assign(reservations, reservations),
}

export default client