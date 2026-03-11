import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:25
 * @route '/admin/tickets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/tickets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:25
 * @route '/admin/tickets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:25
 * @route '/admin/tickets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:25
 * @route '/admin/tickets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:25
 * @route '/admin/tickets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:25
 * @route '/admin/tickets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:25
 * @route '/admin/tickets'
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
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:53
 * @route '/admin/tickets/{ticket}'
 */
export const show = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/tickets/{ticket}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:53
 * @route '/admin/tickets/{ticket}'
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
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:53
 * @route '/admin/tickets/{ticket}'
 */
show.get = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:53
 * @route '/admin/tickets/{ticket}'
 */
show.head = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:53
 * @route '/admin/tickets/{ticket}'
 */
    const showForm = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:53
 * @route '/admin/tickets/{ticket}'
 */
        showForm.get = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:53
 * @route '/admin/tickets/{ticket}'
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
/**
* @see \App\Http\Controllers\Admin\TicketController::respond
 * @see app/Http/Controllers/Admin/TicketController.php:73
 * @route '/admin/tickets/{ticket}/respond'
 */
export const respond = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: respond.url(args, options),
    method: 'post',
})

respond.definition = {
    methods: ["post"],
    url: '/admin/tickets/{ticket}/respond',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::respond
 * @see app/Http/Controllers/Admin/TicketController.php:73
 * @route '/admin/tickets/{ticket}/respond'
 */
respond.url = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return respond.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::respond
 * @see app/Http/Controllers/Admin/TicketController.php:73
 * @route '/admin/tickets/{ticket}/respond'
 */
respond.post = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: respond.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::respond
 * @see app/Http/Controllers/Admin/TicketController.php:73
 * @route '/admin/tickets/{ticket}/respond'
 */
    const respondForm = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: respond.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::respond
 * @see app/Http/Controllers/Admin/TicketController.php:73
 * @route '/admin/tickets/{ticket}/respond'
 */
        respondForm.post = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: respond.url(args, options),
            method: 'post',
        })
    
    respond.form = respondForm
/**
* @see \App\Http\Controllers\Admin\TicketController::close
 * @see app/Http/Controllers/Admin/TicketController.php:95
 * @route '/admin/tickets/{ticket}/close'
 */
export const close = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: close.url(args, options),
    method: 'patch',
})

close.definition = {
    methods: ["patch"],
    url: '/admin/tickets/{ticket}/close',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::close
 * @see app/Http/Controllers/Admin/TicketController.php:95
 * @route '/admin/tickets/{ticket}/close'
 */
close.url = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return close.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::close
 * @see app/Http/Controllers/Admin/TicketController.php:95
 * @route '/admin/tickets/{ticket}/close'
 */
close.patch = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: close.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::close
 * @see app/Http/Controllers/Admin/TicketController.php:95
 * @route '/admin/tickets/{ticket}/close'
 */
    const closeForm = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::close
 * @see app/Http/Controllers/Admin/TicketController.php:95
 * @route '/admin/tickets/{ticket}/close'
 */
        closeForm.patch = (args: { ticket: string | { id: string } } | [ticket: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    close.form = closeForm
const tickets = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
respond: Object.assign(respond, respond),
close: Object.assign(close, close),
}

export default tickets