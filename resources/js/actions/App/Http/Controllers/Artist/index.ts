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
ServiceController: Object.assign(ServiceController, ServiceController),
OrderController: Object.assign(OrderController, OrderController),
AvailabilityController: Object.assign(AvailabilityController, AvailabilityController),
ProfileController: Object.assign(ProfileController, ProfileController),
WalletController: Object.assign(WalletController, WalletController),
SubscriptionController: Object.assign(SubscriptionController, SubscriptionController),
AlbumUploadController: Object.assign(AlbumUploadController, AlbumUploadController),
}

export default Artist