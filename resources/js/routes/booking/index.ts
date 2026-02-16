import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\BookingController::calendar
 * @see app/Http/Controllers/BookingController.php:13
 * @route '/booking/calendar'
 */
export const calendar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})

calendar.definition = {
    methods: ["get","head"],
    url: '/booking/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingController::calendar
 * @see app/Http/Controllers/BookingController.php:13
 * @route '/booking/calendar'
 */
calendar.url = (options?: RouteQueryOptions) => {
    return calendar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::calendar
 * @see app/Http/Controllers/BookingController.php:13
 * @route '/booking/calendar'
 */
calendar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingController::calendar
 * @see app/Http/Controllers/BookingController.php:13
 * @route '/booking/calendar'
 */
calendar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingController::customize
 * @see app/Http/Controllers/BookingController.php:55
 * @route '/booking/customize'
 */
export const customize = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(options),
    method: 'get',
})

customize.definition = {
    methods: ["get","head"],
    url: '/booking/customize',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingController::customize
 * @see app/Http/Controllers/BookingController.php:55
 * @route '/booking/customize'
 */
customize.url = (options?: RouteQueryOptions) => {
    return customize.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::customize
 * @see app/Http/Controllers/BookingController.php:55
 * @route '/booking/customize'
 */
customize.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingController::customize
 * @see app/Http/Controllers/BookingController.php:55
 * @route '/booking/customize'
 */
customize.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: customize.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingController::payment
 * @see app/Http/Controllers/BookingController.php:89
 * @route '/booking/payment'
 */
export const payment = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(options),
    method: 'get',
})

payment.definition = {
    methods: ["get","head"],
    url: '/booking/payment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingController::payment
 * @see app/Http/Controllers/BookingController.php:89
 * @route '/booking/payment'
 */
payment.url = (options?: RouteQueryOptions) => {
    return payment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::payment
 * @see app/Http/Controllers/BookingController.php:89
 * @route '/booking/payment'
 */
payment.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingController::payment
 * @see app/Http/Controllers/BookingController.php:89
 * @route '/booking/payment'
 */
payment.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payment.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingController::store
 * @see app/Http/Controllers/BookingController.php:124
 * @route '/booking/store'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/booking/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BookingController::store
 * @see app/Http/Controllers/BookingController.php:124
 * @route '/booking/store'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::store
 * @see app/Http/Controllers/BookingController.php:124
 * @route '/booking/store'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BookingController::confirmation
 * @see app/Http/Controllers/BookingController.php:166
 * @route '/booking/confirmation/{id}'
 */
export const confirmation = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirmation.url(args, options),
    method: 'get',
})

confirmation.definition = {
    methods: ["get","head"],
    url: '/booking/confirmation/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingController::confirmation
 * @see app/Http/Controllers/BookingController.php:166
 * @route '/booking/confirmation/{id}'
 */
confirmation.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return confirmation.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::confirmation
 * @see app/Http/Controllers/BookingController.php:166
 * @route '/booking/confirmation/{id}'
 */
confirmation.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirmation.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingController::confirmation
 * @see app/Http/Controllers/BookingController.php:166
 * @route '/booking/confirmation/{id}'
 */
confirmation.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: confirmation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingController::receipt
 * @see app/Http/Controllers/BookingController.php:210
 * @route '/booking/{id}/receipt'
 */
export const receipt = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

receipt.definition = {
    methods: ["get","head"],
    url: '/booking/{id}/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingController::receipt
 * @see app/Http/Controllers/BookingController.php:210
 * @route '/booking/{id}/receipt'
 */
receipt.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return receipt.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::receipt
 * @see app/Http/Controllers/BookingController.php:210
 * @route '/booking/{id}/receipt'
 */
receipt.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingController::receipt
 * @see app/Http/Controllers/BookingController.php:210
 * @route '/booking/{id}/receipt'
 */
receipt.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receipt.url(args, options),
    method: 'head',
})
const booking = {
    calendar: Object.assign(calendar, calendar),
customize: Object.assign(customize, customize),
payment: Object.assign(payment, payment),
store: Object.assign(store, store),
confirmation: Object.assign(confirmation, confirmation),
receipt: Object.assign(receipt, receipt),
}

export default booking