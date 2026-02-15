import HomeController from './HomeController'
import Client from './Client'
import Artist from './Artist'
import ArtistController from './ArtistController'
import ServiceController from './ServiceController'
import ArtStreamController from './ArtStreamController'
import FavoriteController from './FavoriteController'
import PlaylistController from './PlaylistController'
import Stream from './Stream'
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
FavoriteController: Object.assign(FavoriteController, FavoriteController),
PlaylistController: Object.assign(PlaylistController, PlaylistController),
Stream: Object.assign(Stream, Stream),
BookingController: Object.assign(BookingController, BookingController),
ConversationController: Object.assign(ConversationController, ConversationController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers