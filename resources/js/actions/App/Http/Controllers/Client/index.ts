import DashboardController from './DashboardController'
import ReservationController from './ReservationController'
import ArtistController from './ArtistController'
import ProfileController from './ProfileController'

const Client = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    ReservationController: Object.assign(ReservationController, ReservationController),
    ArtistController: Object.assign(ArtistController, ArtistController),
    ProfileController: Object.assign(ProfileController, ProfileController),
}

export default Client