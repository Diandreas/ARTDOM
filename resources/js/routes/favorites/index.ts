import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\FavoriteController::index
 * @see app/Http/Controllers/FavoriteController.php:34
 * @route '/favorites'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/favorites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FavoriteController::index
 * @see app/Http/Controllers/FavoriteController.php:34
 * @route '/favorites'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FavoriteController::index
 * @see app/Http/Controllers/FavoriteController.php:34
 * @route '/favorites'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FavoriteController::index
 * @see app/Http/Controllers/FavoriteController.php:34
 * @route '/favorites'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const favorites = {
    index: Object.assign(index, index),
}

export default favorites