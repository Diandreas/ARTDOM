import HomeController from './HomeController'
import Artist from './Artist'
import Client from './Client'
import ArtistController from './ArtistController'
import ServiceController from './ServiceController'
import ArtStreamController from './ArtStreamController'
import Settings from './Settings'
const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
Artist: Object.assign(Artist, Artist),
Client: Object.assign(Client, Client),
ArtistController: Object.assign(ArtistController, ArtistController),
ServiceController: Object.assign(ServiceController, ServiceController),
ArtStreamController: Object.assign(ArtStreamController, ArtStreamController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers