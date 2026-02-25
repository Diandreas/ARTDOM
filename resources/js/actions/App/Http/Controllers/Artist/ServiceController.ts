import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\ServiceController::index
 * @see app/Http/Controllers/Artist/ServiceController.php:27
 * @route '/artist/services'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artist/services',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\ServiceController::index
 * @see app/Http/Controllers/Artist/ServiceController.php:27
 * @route '/artist/services'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ServiceController::index
 * @see app/Http/Controllers/Artist/ServiceController.php:27
 * @route '/artist/services'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\ServiceController::index
 * @see app/Http/Controllers/Artist/ServiceController.php:27
 * @route '/artist/services'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\ServiceController::index
 * @see app/Http/Controllers/Artist/ServiceController.php:27
 * @route '/artist/services'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\ServiceController::index
 * @see app/Http/Controllers/Artist/ServiceController.php:27
 * @route '/artist/services'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\ServiceController::index
 * @see app/Http/Controllers/Artist/ServiceController.php:27
 * @route '/artist/services'
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
* @see \App\Http\Controllers\Artist\ServiceController::store
 * @see app/Http/Controllers/Artist/ServiceController.php:59
 * @route '/artist/services'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/artist/services',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\ServiceController::store
 * @see app/Http/Controllers/Artist/ServiceController.php:59
 * @route '/artist/services'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ServiceController::store
 * @see app/Http/Controllers/Artist/ServiceController.php:59
 * @route '/artist/services'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\ServiceController::store
 * @see app/Http/Controllers/Artist/ServiceController.php:59
 * @route '/artist/services'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ServiceController::store
 * @see app/Http/Controllers/Artist/ServiceController.php:59
 * @route '/artist/services'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Artist\ServiceController::update
 * @see app/Http/Controllers/Artist/ServiceController.php:114
 * @route '/artist/services/{service}'
 */
export const update = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/artist/services/{service}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Artist\ServiceController::update
 * @see app/Http/Controllers/Artist/ServiceController.php:114
 * @route '/artist/services/{service}'
 */
update.url = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { service: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { service: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    service: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        service: typeof args.service === 'object'
                ? args.service.id
                : args.service,
                }

    return update.definition.url
            .replace('{service}', parsedArgs.service.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ServiceController::update
 * @see app/Http/Controllers/Artist/ServiceController.php:114
 * @route '/artist/services/{service}'
 */
update.put = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Artist\ServiceController::update
 * @see app/Http/Controllers/Artist/ServiceController.php:114
 * @route '/artist/services/{service}'
 */
    const updateForm = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ServiceController::update
 * @see app/Http/Controllers/Artist/ServiceController.php:114
 * @route '/artist/services/{service}'
 */
        updateForm.put = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Artist\ServiceController::destroy
 * @see app/Http/Controllers/Artist/ServiceController.php:172
 * @route '/artist/services/{service}'
 */
export const destroy = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/artist/services/{service}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Artist\ServiceController::destroy
 * @see app/Http/Controllers/Artist/ServiceController.php:172
 * @route '/artist/services/{service}'
 */
destroy.url = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { service: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { service: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    service: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        service: typeof args.service === 'object'
                ? args.service.id
                : args.service,
                }

    return destroy.definition.url
            .replace('{service}', parsedArgs.service.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ServiceController::destroy
 * @see app/Http/Controllers/Artist/ServiceController.php:172
 * @route '/artist/services/{service}'
 */
destroy.delete = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Artist\ServiceController::destroy
 * @see app/Http/Controllers/Artist/ServiceController.php:172
 * @route '/artist/services/{service}'
 */
    const destroyForm = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ServiceController::destroy
 * @see app/Http/Controllers/Artist/ServiceController.php:172
 * @route '/artist/services/{service}'
 */
        destroyForm.delete = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Artist\ServiceController::toggle
 * @see app/Http/Controllers/Artist/ServiceController.php:194
 * @route '/artist/services/{service}/toggle'
 */
export const toggle = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/artist/services/{service}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Artist\ServiceController::toggle
 * @see app/Http/Controllers/Artist/ServiceController.php:194
 * @route '/artist/services/{service}/toggle'
 */
toggle.url = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { service: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { service: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    service: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        service: typeof args.service === 'object'
                ? args.service.id
                : args.service,
                }

    return toggle.definition.url
            .replace('{service}', parsedArgs.service.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ServiceController::toggle
 * @see app/Http/Controllers/Artist/ServiceController.php:194
 * @route '/artist/services/{service}/toggle'
 */
toggle.patch = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Artist\ServiceController::toggle
 * @see app/Http/Controllers/Artist/ServiceController.php:194
 * @route '/artist/services/{service}/toggle'
 */
    const toggleForm = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ServiceController::toggle
 * @see app/Http/Controllers/Artist/ServiceController.php:194
 * @route '/artist/services/{service}/toggle'
 */
        toggleForm.patch = (args: { service: string | { id: string } } | [service: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggle.form = toggleForm
/**
* @see \App\Http\Controllers\Artist\ServiceController::reorder
 * @see app/Http/Controllers/Artist/ServiceController.php:213
 * @route '/artist/services/reorder'
 */
export const reorder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/artist/services/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\ServiceController::reorder
 * @see app/Http/Controllers/Artist/ServiceController.php:213
 * @route '/artist/services/reorder'
 */
reorder.url = (options?: RouteQueryOptions) => {
    return reorder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ServiceController::reorder
 * @see app/Http/Controllers/Artist/ServiceController.php:213
 * @route '/artist/services/reorder'
 */
reorder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\ServiceController::reorder
 * @see app/Http/Controllers/Artist/ServiceController.php:213
 * @route '/artist/services/reorder'
 */
    const reorderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reorder.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ServiceController::reorder
 * @see app/Http/Controllers/Artist/ServiceController.php:213
 * @route '/artist/services/reorder'
 */
        reorderForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reorder.url(options),
            method: 'post',
        })
    
    reorder.form = reorderForm
const ServiceController = { index, store, update, destroy, toggle, reorder }

export default ServiceController