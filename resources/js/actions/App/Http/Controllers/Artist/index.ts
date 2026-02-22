import DashboardController from './DashboardController'
import AlbumUploadController from './AlbumUploadController'

const Artist = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    AlbumUploadController: Object.assign(AlbumUploadController, AlbumUploadController),
}

export default Artist