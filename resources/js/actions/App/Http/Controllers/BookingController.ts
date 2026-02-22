import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BookingController::calendar
* @see app/Http/Controllers/BookingController.php:16
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
* @see app/Http/Controllers/BookingController.php:16
* @route '/booking/calendar'
*/
calendar.url = (options?: RouteQueryOptions) => {
    return calendar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::calendar
* @see app/Http/Controllers/BookingController.php:16
* @route '/booking/calendar'
*/
calendar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::calendar
* @see app/Http/Controllers/BookingController.php:16
* @route '/booking/calendar'
*/
calendar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingController::calendar
* @see app/Http/Controllers/BookingController.php:16
* @route '/booking/calendar'
*/
const calendarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: calendar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::calendar
* @see app/Http/Controllers/BookingController.php:16
* @route '/booking/calendar'
*/
calendarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: calendar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::calendar
* @see app/Http/Controllers/BookingController.php:16
* @route '/booking/calendar'
*/
calendarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: calendar.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

calendar.form = calendarForm

/**
* @see \App\Http\Controllers\BookingController::customize
* @see app/Http/Controllers/BookingController.php:58
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
* @see app/Http/Controllers/BookingController.php:58
* @route '/booking/customize'
*/
customize.url = (options?: RouteQueryOptions) => {
    return customize.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::customize
* @see app/Http/Controllers/BookingController.php:58
* @route '/booking/customize'
*/
customize.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::customize
* @see app/Http/Controllers/BookingController.php:58
* @route '/booking/customize'
*/
customize.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: customize.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingController::customize
* @see app/Http/Controllers/BookingController.php:58
* @route '/booking/customize'
*/
const customizeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: customize.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::customize
* @see app/Http/Controllers/BookingController.php:58
* @route '/booking/customize'
*/
customizeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: customize.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::customize
* @see app/Http/Controllers/BookingController.php:58
* @route '/booking/customize'
*/
customizeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: customize.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

customize.form = customizeForm

/**
* @see \App\Http\Controllers\BookingController::payment
* @see app/Http/Controllers/BookingController.php:92
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
* @see app/Http/Controllers/BookingController.php:92
* @route '/booking/payment'
*/
payment.url = (options?: RouteQueryOptions) => {
    return payment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::payment
* @see app/Http/Controllers/BookingController.php:92
* @route '/booking/payment'
*/
payment.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::payment
* @see app/Http/Controllers/BookingController.php:92
* @route '/booking/payment'
*/
payment.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payment.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingController::payment
* @see app/Http/Controllers/BookingController.php:92
* @route '/booking/payment'
*/
const paymentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::payment
* @see app/Http/Controllers/BookingController.php:92
* @route '/booking/payment'
*/
paymentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::payment
* @see app/Http/Controllers/BookingController.php:92
* @route '/booking/payment'
*/
paymentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

payment.form = paymentForm

/**
* @see \App\Http\Controllers\BookingController::store
* @see app/Http/Controllers/BookingController.php:127
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
* @see app/Http/Controllers/BookingController.php:127
* @route '/booking/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::store
* @see app/Http/Controllers/BookingController.php:127
* @route '/booking/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BookingController::store
* @see app/Http/Controllers/BookingController.php:127
* @route '/booking/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BookingController::store
* @see app/Http/Controllers/BookingController.php:127
* @route '/booking/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\BookingController::confirmation
* @see app/Http/Controllers/BookingController.php:169
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
* @see app/Http/Controllers/BookingController.php:169
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
* @see app/Http/Controllers/BookingController.php:169
* @route '/booking/confirmation/{id}'
*/
confirmation.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirmation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::confirmation
* @see app/Http/Controllers/BookingController.php:169
* @route '/booking/confirmation/{id}'
*/
confirmation.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: confirmation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingController::confirmation
* @see app/Http/Controllers/BookingController.php:169
* @route '/booking/confirmation/{id}'
*/
const confirmationForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: confirmation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::confirmation
* @see app/Http/Controllers/BookingController.php:169
* @route '/booking/confirmation/{id}'
*/
confirmationForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: confirmation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BookingController::confirmation
* @see app/Http/Controllers/BookingController.php:169
* @route '/booking/confirmation/{id}'
*/
confirmationForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: confirmation.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

confirmation.form = confirmationForm

const BookingController = { calendar, customize, payment, store, confirmation }

export default BookingController