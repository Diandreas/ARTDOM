import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ClientActivityController::index
* @see app/Http/Controllers/Admin/ClientActivityController.php:19
* @route '/admin/client-activity'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/client-activity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ClientActivityController::index
* @see app/Http/Controllers/Admin/ClientActivityController.php:19
* @route '/admin/client-activity'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClientActivityController::index
* @see app/Http/Controllers/Admin/ClientActivityController.php:19
* @route '/admin/client-activity'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ClientActivityController::index
* @see app/Http/Controllers/Admin/ClientActivityController.php:19
* @route '/admin/client-activity'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ClientActivityController::index
* @see app/Http/Controllers/Admin/ClientActivityController.php:19
* @route '/admin/client-activity'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ClientActivityController::index
* @see app/Http/Controllers/Admin/ClientActivityController.php:19
* @route '/admin/client-activity'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ClientActivityController::index
* @see app/Http/Controllers/Admin/ClientActivityController.php:19
* @route '/admin/client-activity'
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

const ClientActivityController = { index }

export default ClientActivityController