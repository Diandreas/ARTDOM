import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import profile from './profile'
import albums from './albums'
/**
* @see \App\Http\Controllers\Artist\DashboardController::dashboard
 * @see app/Http/Controllers/Artist/DashboardController.php:14
 * @route '/artist/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/artist/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\DashboardController::dashboard
 * @see app/Http/Controllers/Artist/DashboardController.php:14
 * @route '/artist/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\DashboardController::dashboard
 * @see app/Http/Controllers/Artist/DashboardController.php:14
 * @route '/artist/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\DashboardController::dashboard
 * @see app/Http/Controllers/Artist/DashboardController.php:14
 * @route '/artist/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArtistController::show
 * @see app/Http/Controllers/ArtistController.php:121
 * @route '/artist/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/artist/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArtistController::show
 * @see app/Http/Controllers/ArtistController.php:121
 * @route '/artist/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArtistController::show
 * @see app/Http/Controllers/ArtistController.php:121
 * @route '/artist/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArtistController::show
 * @see app/Http/Controllers/ArtistController.php:121
 * @route '/artist/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const artist = {
    dashboard: Object.assign(dashboard, dashboard),
profile: Object.assign(profile, profile),
albums: Object.assign(albums, albums),
show: Object.assign(show, show),
}

export default artist