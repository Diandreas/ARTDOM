import Auth from './Auth'
import DashboardController from './DashboardController'
import ArtistValidationController from './ArtistValidationController'
import TicketController from './TicketController'
import ContentModerationController from './ContentModerationController'
import ReportController from './ReportController'
import BroadcastNotificationController from './BroadcastNotificationController'
import ClientActivityController from './ClientActivityController'
import FinancialOverviewController from './FinancialOverviewController'
import UserManagementController from './UserManagementController'
import SuperAdminCrudController from './SuperAdminCrudController'

const Admin = {
    Auth: Object.assign(Auth, Auth),
    DashboardController: Object.assign(DashboardController, DashboardController),
    ArtistValidationController: Object.assign(ArtistValidationController, ArtistValidationController),
    TicketController: Object.assign(TicketController, TicketController),
    ContentModerationController: Object.assign(ContentModerationController, ContentModerationController),
    ReportController: Object.assign(ReportController, ReportController),
    BroadcastNotificationController: Object.assign(BroadcastNotificationController, BroadcastNotificationController),
    ClientActivityController: Object.assign(ClientActivityController, ClientActivityController),
    FinancialOverviewController: Object.assign(FinancialOverviewController, FinancialOverviewController),
    UserManagementController: Object.assign(UserManagementController, UserManagementController),
    SuperAdminCrudController: Object.assign(SuperAdminCrudController, SuperAdminCrudController),
}

export default Admin