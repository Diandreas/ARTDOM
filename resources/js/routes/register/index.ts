import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
 * @see routes/web.php:17
 * @route '/register/selection'
 */
export const selection = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: selection.url(options),
    method: 'get',
})

selection.definition = {
    methods: ["get","head"],
    url: '/register/selection',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:17
 * @route '/register/selection'
 */
selection.url = (options?: RouteQueryOptions) => {
    return selection.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:17
 * @route '/register/selection'
 */
selection.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: selection.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:17
 * @route '/register/selection'
 */
selection.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: selection.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:17
 * @route '/register/selection'
 */
    const selectionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: selection.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:17
 * @route '/register/selection'
 */
        selectionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: selection.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:17
 * @route '/register/selection'
 */
        selectionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: selection.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    selection.form = selectionForm
/**
 * @see routes/web.php:21
 * @route '/register/artist'
 */
export const artist = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: artist.url(options),
    method: 'get',
})

artist.definition = {
    methods: ["get","head"],
    url: '/register/artist',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:21
 * @route '/register/artist'
 */
artist.url = (options?: RouteQueryOptions) => {
    return artist.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:21
 * @route '/register/artist'
 */
artist.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: artist.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:21
 * @route '/register/artist'
 */
artist.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: artist.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:21
 * @route '/register/artist'
 */
    const artistForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: artist.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:21
 * @route '/register/artist'
 */
        artistForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: artist.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:21
 * @route '/register/artist'
 */
        artistForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: artist.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    artist.form = artistForm
const register = {
    store: Object.assign(store, store),
selection: Object.assign(selection, selection),
artist: Object.assign(artist, artist),
}

export default register