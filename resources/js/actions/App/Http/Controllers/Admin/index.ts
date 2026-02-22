import Auth from './Auth'
import DashboardController from './DashboardController'
import ArtistValidationController from './ArtistValidationController'
import TicketController from './TicketController'
import UserManagementController from './UserManagementController'

const Admin = {
    Auth: Object.assign(Auth, Auth),
    DashboardController: Object.assign(DashboardController, DashboardController),
    ArtistValidationController: Object.assign(ArtistValidationController, ArtistValidationController),
    TicketController: Object.assign(TicketController, TicketController),
    UserManagementController: Object.assign(UserManagementController, UserManagementController),
}

export default Admin