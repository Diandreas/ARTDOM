import HomeController from './HomeController'
import Client from './Client'
import Artist from './Artist'
import ArtistController from './ArtistController'
import ServiceController from './ServiceController'
import ArtStreamController from './ArtStreamController'
import BookingController from './BookingController'
import ConversationController from './ConversationController'
import Settings from './Settings'
const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
Client: Object.assign(Client, Client),
Artist: Object.assign(Artist, Artist),
ArtistController: Object.assign(ArtistController, ArtistController),
ServiceController: Object.assign(ServiceController, ServiceController),
ArtStreamController: Object.assign(ArtStreamController, ArtStreamController),
BookingController: Object.assign(BookingController, BookingController),
ConversationController: Object.assign(ConversationController, ConversationController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers