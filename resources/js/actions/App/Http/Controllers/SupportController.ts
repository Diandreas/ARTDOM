import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:14
 * @route '/support'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/support',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:14
 * @route '/support'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:14
 * @route '/support'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:14
 * @route '/support'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:14
 * @route '/support'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:14
 * @route '/support'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:14
 * @route '/support'
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
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:22
 * @route '/support/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/support/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:22
 * @route '/support/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:22
 * @route '/support/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:22
 * @route '/support/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:22
 * @route '/support/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:22
 * @route '/support/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:22
 * @route '/support/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/support',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:57
 * @route '/support/{ticket}'
 */
export const show = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/support/{ticket}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:57
 * @route '/support/{ticket}'
 */
show.url = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return show.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:57
 * @route '/support/{ticket}'
 */
show.get = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:57
 * @route '/support/{ticket}'
 */
show.head = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:57
 * @route '/support/{ticket}'
 */
    const showForm = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:57
 * @route '/support/{ticket}'
 */
        showForm.get = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:57
 * @route '/support/{ticket}'
 */
        showForm.head = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const SupportController = { index, create, store, show }

export default SupportController