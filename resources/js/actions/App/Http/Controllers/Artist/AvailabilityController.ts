import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\AvailabilityController::index
 * @see app/Http/Controllers/Artist/AvailabilityController.php:27
 * @route '/artist/availability'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artist/availability',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\AvailabilityController::index
 * @see app/Http/Controllers/Artist/AvailabilityController.php:27
 * @route '/artist/availability'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AvailabilityController::index
 * @see app/Http/Controllers/Artist/AvailabilityController.php:27
 * @route '/artist/availability'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\AvailabilityController::index
 * @see app/Http/Controllers/Artist/AvailabilityController.php:27
 * @route '/artist/availability'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\AvailabilityController::index
 * @see app/Http/Controllers/Artist/AvailabilityController.php:27
 * @route '/artist/availability'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\AvailabilityController::index
 * @see app/Http/Controllers/Artist/AvailabilityController.php:27
 * @route '/artist/availability'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\AvailabilityController::index
 * @see app/Http/Controllers/Artist/AvailabilityController.php:27
 * @route '/artist/availability'
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
* @see \App\Http\Controllers\Artist\AvailabilityController::store
 * @see app/Http/Controllers/Artist/AvailabilityController.php:59
 * @route '/artist/availability'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/artist/availability',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\AvailabilityController::store
 * @see app/Http/Controllers/Artist/AvailabilityController.php:59
 * @route '/artist/availability'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AvailabilityController::store
 * @see app/Http/Controllers/Artist/AvailabilityController.php:59
 * @route '/artist/availability'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\AvailabilityController::store
 * @see app/Http/Controllers/Artist/AvailabilityController.php:59
 * @route '/artist/availability'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\AvailabilityController::store
 * @see app/Http/Controllers/Artist/AvailabilityController.php:59
 * @route '/artist/availability'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Artist\AvailabilityController::block
 * @see app/Http/Controllers/Artist/AvailabilityController.php:95
 * @route '/artist/availability/block'
 */
export const block = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: block.url(options),
    method: 'post',
})

block.definition = {
    methods: ["post"],
    url: '/artist/availability/block',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\AvailabilityController::block
 * @see app/Http/Controllers/Artist/AvailabilityController.php:95
 * @route '/artist/availability/block'
 */
block.url = (options?: RouteQueryOptions) => {
    return block.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AvailabilityController::block
 * @see app/Http/Controllers/Artist/AvailabilityController.php:95
 * @route '/artist/availability/block'
 */
block.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: block.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\AvailabilityController::block
 * @see app/Http/Controllers/Artist/AvailabilityController.php:95
 * @route '/artist/availability/block'
 */
    const blockForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: block.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\AvailabilityController::block
 * @see app/Http/Controllers/Artist/AvailabilityController.php:95
 * @route '/artist/availability/block'
 */
        blockForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: block.url(options),
            method: 'post',
        })
    
    block.form = blockForm
/**
* @see \App\Http\Controllers\Artist\AvailabilityController::destroy
 * @see app/Http/Controllers/Artist/AvailabilityController.php:124
 * @route '/artist/availability/{availability}'
 */
export const destroy = (args: { availability: string | { id: string } } | [availability: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/artist/availability/{availability}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Artist\AvailabilityController::destroy
 * @see app/Http/Controllers/Artist/AvailabilityController.php:124
 * @route '/artist/availability/{availability}'
 */
destroy.url = (args: { availability: string | { id: string } } | [availability: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { availability: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { availability: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    availability: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        availability: typeof args.availability === 'object'
                ? args.availability.id
                : args.availability,
                }

    return destroy.definition.url
            .replace('{availability}', parsedArgs.availability.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AvailabilityController::destroy
 * @see app/Http/Controllers/Artist/AvailabilityController.php:124
 * @route '/artist/availability/{availability}'
 */
destroy.delete = (args: { availability: string | { id: string } } | [availability: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Artist\AvailabilityController::destroy
 * @see app/Http/Controllers/Artist/AvailabilityController.php:124
 * @route '/artist/availability/{availability}'
 */
    const destroyForm = (args: { availability: string | { id: string } } | [availability: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\AvailabilityController::destroy
 * @see app/Http/Controllers/Artist/AvailabilityController.php:124
 * @route '/artist/availability/{availability}'
 */
        destroyForm.delete = (args: { availability: string | { id: string } } | [availability: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AvailabilityController = { index, store, block, destroy }

export default AvailabilityController