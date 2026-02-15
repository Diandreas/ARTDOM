import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
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
/**
 * @see routes/web.php:44
 * @route '/artstream/player'
 */
export const player = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: player.url(options),
    method: 'get',
})

player.definition = {
    methods: ["get","head"],
    url: '/artstream/player',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:44
 * @route '/artstream/player'
 */
player.url = (options?: RouteQueryOptions) => {
    return player.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:44
 * @route '/artstream/player'
 */
player.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: player.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:44
 * @route '/artstream/player'
 */
player.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: player.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:44
 * @route '/artstream/player'
 */
    const playerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: player.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:44
 * @route '/artstream/player'
 */
        playerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: player.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:44
 * @route '/artstream/player'
 */
        playerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: player.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    player.form = playerForm
const artstream = {
    index: Object.assign(index, index),
player: Object.assign(player, player),
}

export default artstream