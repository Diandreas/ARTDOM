import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\DashboardController::index
 * @see app/Http/Controllers/Artist/DashboardController.php:14
 * @route '/artist/dashboard'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artist/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\DashboardController::index
 * @see app/Http/Controllers/Artist/DashboardController.php:14
 * @route '/artist/dashboard'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\DashboardController::index
 * @see app/Http/Controllers/Artist/DashboardController.php:14
 * @route '/artist/dashboard'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\DashboardController::index
 * @see app/Http/Controllers/Artist/DashboardController.php:14
 * @route '/artist/dashboard'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const DashboardController = { index }

export default DashboardController