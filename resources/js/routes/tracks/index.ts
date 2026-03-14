import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\FavoriteController::favorite
* @see app/Http/Controllers/FavoriteController.php:11
* @route '/tracks/{track}/favorite'
*/
export const favorite = (args: { track: string | number | { id: string | number } } | [track: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: favorite.url(args, options),
    method: 'post',
})

favorite.definition = {
    methods: ["post"],
    url: '/tracks/{track}/favorite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FavoriteController::favorite
* @see app/Http/Controllers/FavoriteController.php:11
* @route '/tracks/{track}/favorite'
*/
favorite.url = (args: { track: string | number | { id: string | number } } | [track: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { track: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { track: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            track: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        track: typeof args.track === 'object'
        ? args.track.id
        : args.track,
    }

    return favorite.definition.url
            .replace('{track}', parsedArgs.track.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FavoriteController::favorite
* @see app/Http/Controllers/FavoriteController.php:11
* @route '/tracks/{track}/favorite'
*/
favorite.post = (args: { track: string | number | { id: string | number } } | [track: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: favorite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FavoriteController::favorite
* @see app/Http/Controllers/FavoriteController.php:11
* @route '/tracks/{track}/favorite'
*/
const favoriteForm = (args: { track: string | number | { id: string | number } } | [track: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: favorite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FavoriteController::favorite
* @see app/Http/Controllers/FavoriteController.php:11
* @route '/tracks/{track}/favorite'
*/
favoriteForm.post = (args: { track: string | number | { id: string | number } } | [track: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: favorite.url(args, options),
    method: 'post',
})

favorite.form = favoriteForm

const tracks = {
    favorite: Object.assign(favorite, favorite),
}

export default tracks