import HomeController from './HomeController'
import Artist from './Artist'
import ArtStreamController from './ArtStreamController'
import Settings from './Settings'
const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
Artist: Object.assign(Artist, Artist),
ArtStreamController: Object.assign(ArtStreamController, ArtStreamController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers