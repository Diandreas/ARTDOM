import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FavoriteController::toggle
 * @see app/Http/Controllers/FavoriteController.php:11
 * @route '/tracks/{track}/favorite'
 */
export const toggle = (args: { track: string | { id: string } } | [track: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/tracks/{track}/favorite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FavoriteController::toggle
 * @see app/Http/Controllers/FavoriteController.php:11
 * @route '/tracks/{track}/favorite'
 */
toggle.url = (args: { track: string | { id: string } } | [track: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return toggle.definition.url
            .replace('{track}', parsedArgs.track.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FavoriteController::toggle
 * @see app/Http/Controllers/FavoriteController.php:11
 * @route '/tracks/{track}/favorite'
 */
toggle.post = (args: { track: string | { id: string } } | [track: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FavoriteController::toggle
 * @see app/Http/Controllers/FavoriteController.php:11
 * @route '/tracks/{track}/favorite'
 */
    const toggleForm = (args: { track: string | { id: string } } | [track: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FavoriteController::toggle
 * @see app/Http/Controllers/FavoriteController.php:11
 * @route '/tracks/{track}/favorite'
 */
        toggleForm.post = (args: { track: string | { id: string } } | [track: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, options),
            method: 'post',
        })
    
    toggle.form = toggleForm
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

    /**
* @see \App\Http\Controllers\FavoriteController::index
 * @see app/Http/Controllers/FavoriteController.php:34
 * @route '/favorites'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FavoriteController::index
 * @see app/Http/Controllers/FavoriteController.php:34
 * @route '/favorites'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FavoriteController::index
 * @see app/Http/Controllers/FavoriteController.php:34
 * @route '/favorites'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const FavoriteController = { toggle, index }

export default FavoriteController