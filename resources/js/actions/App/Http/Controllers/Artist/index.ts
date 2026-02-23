import DashboardController from './DashboardController'
import ProfileController from './ProfileController'
import AlbumUploadController from './AlbumUploadController'
const Artist = {
    DashboardController: Object.assign(DashboardController, DashboardController),
ProfileController: Object.assign(ProfileController, ProfileController),
AlbumUploadController: Object.assign(AlbumUploadController, AlbumUploadController),
}

export default Artist