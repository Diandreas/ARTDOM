import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import videos from './videos'
/**
* @see \App\Http\Controllers\Stream\VideoController::index
 * @see app/Http/Controllers/Stream/VideoController.php:29
 * @route '/arttube'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/arttube',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Stream\VideoController::index
 * @see app/Http/Controllers/Stream/VideoController.php:29
 * @route '/arttube'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Stream\VideoController::index
 * @see app/Http/Controllers/Stream/VideoController.php:29
 * @route '/arttube'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Stream\VideoController::index
 * @see app/Http/Controllers/Stream/VideoController.php:29
 * @route '/arttube'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const arttube = {
    index: Object.assign(index, index),
videos: Object.assign(videos, videos),
}

export default arttube