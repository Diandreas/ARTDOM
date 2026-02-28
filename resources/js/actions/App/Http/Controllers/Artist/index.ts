import DashboardController from './DashboardController'
import ServiceController from './ServiceController'
import OrderController from './OrderController'
import AvailabilityController from './AvailabilityController'
import ProfileController from './ProfileController'
import WalletController from './WalletController'
import SubscriptionController from './SubscriptionController'
import AlbumUploadController from './AlbumUploadController'
const Artist = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    ProfileController: Object.assign(ProfileController, ProfileController),
    AlbumUploadController: Object.assign(AlbumUploadController, AlbumUploadController),
}

export default Artist