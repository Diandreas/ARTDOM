import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artstream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArtStreamController::album
 * @see app/Http/Controllers/ArtStreamController.php:105
 * @route '/artstream/album/{album}'
 */
export const album = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: album.url(args, options),
    method: 'get',
})

album.definition = {
    methods: ["get","head"],
    url: '/artstream/album/{album}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArtStreamController::album
 * @see app/Http/Controllers/ArtStreamController.php:105
 * @route '/artstream/album/{album}'
 */
album.url = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { album: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { album: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    album: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        album: typeof args.album === 'object'
                ? args.album.id
                : args.album,
                }

    return album.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArtStreamController::album
 * @see app/Http/Controllers/ArtStreamController.php:105
 * @route '/artstream/album/{album}'
 */
album.get = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: album.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArtStreamController::album
 * @see app/Http/Controllers/ArtStreamController.php:105
 * @route '/artstream/album/{album}'
 */
album.head = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: album.url(args, options),
    method: 'head',
})
const ArtStreamController = { index, album }

export default ArtStreamController