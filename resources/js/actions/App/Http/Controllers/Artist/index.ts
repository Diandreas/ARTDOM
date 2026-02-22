import DashboardController from './DashboardController'
import ProfileController from './ProfileController'
import AlbumUploadController from './AlbumUploadController'

const Artist = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    AlbumUploadController: Object.assign(AlbumUploadController, AlbumUploadController),
}

export default Artist