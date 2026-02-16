import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ArtistController::index
 * @see app/Http/Controllers/ArtistController.php:14
 * @route '/artists'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artists',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArtistController::index
 * @see app/Http/Controllers/ArtistController.php:14
 * @route '/artists'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArtistController::index
 * @see app/Http/Controllers/ArtistController.php:14
 * @route '/artists'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArtistController::index
 * @see app/Http/Controllers/ArtistController.php:14
 * @route '/artists'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const artists = {
    index: Object.assign(index, index),
}

export default artists