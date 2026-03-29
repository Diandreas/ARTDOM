import DashboardController from './DashboardController'
import ReservationController from './ReservationController'
import ProfileController from './ProfileController'

const Client = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    ReservationController: Object.assign(ReservationController, ReservationController),
    ProfileController: Object.assign(ProfileController, ProfileController),
}

export default Client