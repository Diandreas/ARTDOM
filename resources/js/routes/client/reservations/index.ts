import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Client\ReservationController::index
 * @see app/Http/Controllers/Client/ReservationController.php:15
 * @route '/client/reservations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/client/reservations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Client\ReservationController::index
 * @see app/Http/Controllers/Client/ReservationController.php:15
 * @route '/client/reservations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Client\ReservationController::index
 * @see app/Http/Controllers/Client/ReservationController.php:15
 * @route '/client/reservations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Client\ReservationController::index
 * @see app/Http/Controllers/Client/ReservationController.php:15
 * @route '/client/reservations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Client\ReservationController::show
 * @see app/Http/Controllers/Client/ReservationController.php:33
 * @route '/client/reservations/{reservation}'
 */
export const show = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/client/reservations/{reservation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Client\ReservationController::show
 * @see app/Http/Controllers/Client/ReservationController.php:33
 * @route '/client/reservations/{reservation}'
 */
show.url = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: args.reservation,
                }

    return show.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Client\ReservationController::show
 * @see app/Http/Controllers/Client/ReservationController.php:33
 * @route '/client/reservations/{reservation}'
 */
show.get = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Client\ReservationController::show
 * @see app/Http/Controllers/Client/ReservationController.php:33
 * @route '/client/reservations/{reservation}'
 */
show.head = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Client\ReservationController::cancel
 * @see app/Http/Controllers/Client/ReservationController.php:59
 * @route '/client/reservations/{reservation}/cancel'
 */
export const cancel = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/client/reservations/{reservation}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Client\ReservationController::cancel
 * @see app/Http/Controllers/Client/ReservationController.php:59
 * @route '/client/reservations/{reservation}/cancel'
 */
cancel.url = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: args.reservation,
                }

    return cancel.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Client\ReservationController::cancel
 * @see app/Http/Controllers/Client/ReservationController.php:59
 * @route '/client/reservations/{reservation}/cancel'
 */
cancel.post = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Client\ReservationController::review
 * @see app/Http/Controllers/Client/ReservationController.php:67
 * @route '/client/reservations/{reservation}/review'
 */
export const review = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

review.definition = {
    methods: ["post"],
    url: '/client/reservations/{reservation}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Client\ReservationController::review
 * @see app/Http/Controllers/Client/ReservationController.php:67
 * @route '/client/reservations/{reservation}/review'
 */
review.url = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: args.reservation,
                }

    return review.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Client\ReservationController::review
 * @see app/Http/Controllers/Client/ReservationController.php:67
 * @route '/client/reservations/{reservation}/review'
 */
review.post = (args: { reservation: string | number } | [reservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})
const reservations = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
cancel: Object.assign(cancel, cancel),
review: Object.assign(review, review),
}

export default reservations