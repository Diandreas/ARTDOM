import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artstream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ArtStreamController::index
 * @see app/Http/Controllers/ArtStreamController.php:12
 * @route '/artstream'
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
const ArtStreamController = { index }

export default ArtStreamController