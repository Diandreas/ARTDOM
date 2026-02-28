import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\OrderController::index
 * @see app/Http/Controllers/Artist/OrderController.php:27
 * @route '/artist/orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artist/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\OrderController::index
 * @see app/Http/Controllers/Artist/OrderController.php:27
 * @route '/artist/orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\OrderController::index
 * @see app/Http/Controllers/Artist/OrderController.php:27
 * @route '/artist/orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\OrderController::index
 * @see app/Http/Controllers/Artist/OrderController.php:27
 * @route '/artist/orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\OrderController::index
 * @see app/Http/Controllers/Artist/OrderController.php:27
 * @route '/artist/orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\OrderController::index
 * @see app/Http/Controllers/Artist/OrderController.php:27
 * @route '/artist/orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\OrderController::index
 * @see app/Http/Controllers/Artist/OrderController.php:27
 * @route '/artist/orders'
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
* @see \App\Http\Controllers\Artist\OrderController::show
 * @see app/Http/Controllers/Artist/OrderController.php:63
 * @route '/artist/orders/{reservation}'
 */
export const show = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/artist/orders/{reservation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\OrderController::show
 * @see app/Http/Controllers/Artist/OrderController.php:63
 * @route '/artist/orders/{reservation}'
 */
show.url = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return show.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\OrderController::show
 * @see app/Http/Controllers/Artist/OrderController.php:63
 * @route '/artist/orders/{reservation}'
 */
show.get = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\OrderController::show
 * @see app/Http/Controllers/Artist/OrderController.php:63
 * @route '/artist/orders/{reservation}'
 */
show.head = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\OrderController::show
 * @see app/Http/Controllers/Artist/OrderController.php:63
 * @route '/artist/orders/{reservation}'
 */
    const showForm = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\OrderController::show
 * @see app/Http/Controllers/Artist/OrderController.php:63
 * @route '/artist/orders/{reservation}'
 */
        showForm.get = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\OrderController::show
 * @see app/Http/Controllers/Artist/OrderController.php:63
 * @route '/artist/orders/{reservation}'
 */
        showForm.head = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Artist\OrderController::accept
 * @see app/Http/Controllers/Artist/OrderController.php:92
 * @route '/artist/orders/{reservation}/accept'
 */
export const accept = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/artist/orders/{reservation}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\OrderController::accept
 * @see app/Http/Controllers/Artist/OrderController.php:92
 * @route '/artist/orders/{reservation}/accept'
 */
accept.url = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return accept.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\OrderController::accept
 * @see app/Http/Controllers/Artist/OrderController.php:92
 * @route '/artist/orders/{reservation}/accept'
 */
accept.post = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\OrderController::accept
 * @see app/Http/Controllers/Artist/OrderController.php:92
 * @route '/artist/orders/{reservation}/accept'
 */
    const acceptForm = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: accept.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\OrderController::accept
 * @see app/Http/Controllers/Artist/OrderController.php:92
 * @route '/artist/orders/{reservation}/accept'
 */
        acceptForm.post = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: accept.url(args, options),
            method: 'post',
        })
    
    accept.form = acceptForm
/**
* @see \App\Http\Controllers\Artist\OrderController::decline
 * @see app/Http/Controllers/Artist/OrderController.php:122
 * @route '/artist/orders/{reservation}/decline'
 */
export const decline = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

decline.definition = {
    methods: ["post"],
    url: '/artist/orders/{reservation}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\OrderController::decline
 * @see app/Http/Controllers/Artist/OrderController.php:122
 * @route '/artist/orders/{reservation}/decline'
 */
decline.url = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return decline.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\OrderController::decline
 * @see app/Http/Controllers/Artist/OrderController.php:122
 * @route '/artist/orders/{reservation}/decline'
 */
decline.post = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\OrderController::decline
 * @see app/Http/Controllers/Artist/OrderController.php:122
 * @route '/artist/orders/{reservation}/decline'
 */
    const declineForm = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: decline.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\OrderController::decline
 * @see app/Http/Controllers/Artist/OrderController.php:122
 * @route '/artist/orders/{reservation}/decline'
 */
        declineForm.post = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: decline.url(args, options),
            method: 'post',
        })
    
    decline.form = declineForm
/**
* @see \App\Http\Controllers\Artist\OrderController::checkIn
 * @see app/Http/Controllers/Artist/OrderController.php:168
 * @route '/artist/orders/{reservation}/checkin'
 */
export const checkIn = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkIn.url(args, options),
    method: 'post',
})

checkIn.definition = {
    methods: ["post"],
    url: '/artist/orders/{reservation}/checkin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\OrderController::checkIn
 * @see app/Http/Controllers/Artist/OrderController.php:168
 * @route '/artist/orders/{reservation}/checkin'
 */
checkIn.url = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return checkIn.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\OrderController::checkIn
 * @see app/Http/Controllers/Artist/OrderController.php:168
 * @route '/artist/orders/{reservation}/checkin'
 */
checkIn.post = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkIn.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\OrderController::checkIn
 * @see app/Http/Controllers/Artist/OrderController.php:168
 * @route '/artist/orders/{reservation}/checkin'
 */
    const checkInForm = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkIn.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\OrderController::checkIn
 * @see app/Http/Controllers/Artist/OrderController.php:168
 * @route '/artist/orders/{reservation}/checkin'
 */
        checkInForm.post = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkIn.url(args, options),
            method: 'post',
        })
    
    checkIn.form = checkInForm
/**
* @see \App\Http\Controllers\Artist\OrderController::checkOut
 * @see app/Http/Controllers/Artist/OrderController.php:206
 * @route '/artist/orders/{reservation}/checkout'
 */
export const checkOut = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkOut.url(args, options),
    method: 'post',
})

checkOut.definition = {
    methods: ["post"],
    url: '/artist/orders/{reservation}/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\OrderController::checkOut
 * @see app/Http/Controllers/Artist/OrderController.php:206
 * @route '/artist/orders/{reservation}/checkout'
 */
checkOut.url = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return checkOut.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\OrderController::checkOut
 * @see app/Http/Controllers/Artist/OrderController.php:206
 * @route '/artist/orders/{reservation}/checkout'
 */
checkOut.post = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkOut.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\OrderController::checkOut
 * @see app/Http/Controllers/Artist/OrderController.php:206
 * @route '/artist/orders/{reservation}/checkout'
 */
    const checkOutForm = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkOut.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\OrderController::checkOut
 * @see app/Http/Controllers/Artist/OrderController.php:206
 * @route '/artist/orders/{reservation}/checkout'
 */
        checkOutForm.post = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkOut.url(args, options),
            method: 'post',
        })
    
    checkOut.form = checkOutForm
const OrderController = { index, show, accept, decline, checkIn, checkOut }

export default OrderController