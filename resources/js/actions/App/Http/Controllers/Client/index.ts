import DashboardController from './DashboardController'
import ReservationController from './ReservationController'

const Client = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    ReservationController: Object.assign(ReservationController, ReservationController),
}

export default Client