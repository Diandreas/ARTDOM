import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::create
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:15
* @route '/admin/broadcast'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/broadcast',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::create
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:15
* @route '/admin/broadcast'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::create
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:15
* @route '/admin/broadcast'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::create
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:15
* @route '/admin/broadcast'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::create
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:15
* @route '/admin/broadcast'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::create
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:15
* @route '/admin/broadcast'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::create
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:15
* @route '/admin/broadcast'
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
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::store
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:20
* @route '/admin/broadcast'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/broadcast',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::store
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:20
* @route '/admin/broadcast'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::store
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:20
* @route '/admin/broadcast'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::store
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:20
* @route '/admin/broadcast'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BroadcastNotificationController::store
* @see app/Http/Controllers/Admin/BroadcastNotificationController.php:20
* @route '/admin/broadcast'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const BroadcastNotificationController = { create, store }

export default BroadcastNotificationController