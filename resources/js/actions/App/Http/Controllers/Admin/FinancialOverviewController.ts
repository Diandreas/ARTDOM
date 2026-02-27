import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\FinancialOverviewController::index
* @see app/Http/Controllers/Admin/FinancialOverviewController.php:15
* @route '/admin/financial-overview'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/financial-overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FinancialOverviewController::index
* @see app/Http/Controllers/Admin/FinancialOverviewController.php:15
* @route '/admin/financial-overview'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FinancialOverviewController::index
* @see app/Http/Controllers/Admin/FinancialOverviewController.php:15
* @route '/admin/financial-overview'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FinancialOverviewController::index
* @see app/Http/Controllers/Admin/FinancialOverviewController.php:15
* @route '/admin/financial-overview'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FinancialOverviewController::index
* @see app/Http/Controllers/Admin/FinancialOverviewController.php:15
* @route '/admin/financial-overview'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FinancialOverviewController::index
* @see app/Http/Controllers/Admin/FinancialOverviewController.php:15
* @route '/admin/financial-overview'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FinancialOverviewController::index
* @see app/Http/Controllers/Admin/FinancialOverviewController.php:15
* @route '/admin/financial-overview'
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

const FinancialOverviewController = { index }

export default FinancialOverviewController