import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\Stream\VideoController::show
 * @see app/Http/Controllers/Stream/VideoController.php:81
 * @route '/arttube/videos/{video}'
 */
export const show = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/arttube/videos/{video}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Stream\VideoController::show
 * @see app/Http/Controllers/Stream/VideoController.php:81
 * @route '/arttube/videos/{video}'
 */
show.url = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { video: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { video: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    video: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        video: typeof args.video === 'object'
                ? args.video.id
                : args.video,
                }

    return show.definition.url
            .replace('{video}', parsedArgs.video.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Stream\VideoController::show
 * @see app/Http/Controllers/Stream/VideoController.php:81
 * @route '/arttube/videos/{video}'
 */
show.get = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Stream\VideoController::show
 * @see app/Http/Controllers/Stream/VideoController.php:81
 * @route '/arttube/videos/{video}'
 */
show.head = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Stream\VideoController::like
 * @see app/Http/Controllers/Stream/VideoController.php:157
 * @route '/arttube/videos/{video}/like'
 */
export const like = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

like.definition = {
    methods: ["post"],
    url: '/arttube/videos/{video}/like',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Stream\VideoController::like
 * @see app/Http/Controllers/Stream/VideoController.php:157
 * @route '/arttube/videos/{video}/like'
 */
like.url = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { video: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { video: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    video: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        video: typeof args.video === 'object'
                ? args.video.id
                : args.video,
                }

    return like.definition.url
            .replace('{video}', parsedArgs.video.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Stream\VideoController::like
 * @see app/Http/Controllers/Stream/VideoController.php:157
 * @route '/arttube/videos/{video}/like'
 */
like.post = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Stream\VideoController::storeComment
 * @see app/Http/Controllers/Stream/VideoController.php:132
 * @route '/arttube/videos/{video}/comments'
 */
export const storeComment = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComment.url(args, options),
    method: 'post',
})

storeComment.definition = {
    methods: ["post"],
    url: '/arttube/videos/{video}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Stream\VideoController::storeComment
 * @see app/Http/Controllers/Stream/VideoController.php:132
 * @route '/arttube/videos/{video}/comments'
 */
storeComment.url = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { video: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { video: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    video: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        video: typeof args.video === 'object'
                ? args.video.id
                : args.video,
                }

    return storeComment.definition.url
            .replace('{video}', parsedArgs.video.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Stream\VideoController::storeComment
 * @see app/Http/Controllers/Stream/VideoController.php:132
 * @route '/arttube/videos/{video}/comments'
 */
storeComment.post = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComment.url(args, options),
    method: 'post',
})
const VideoController = { index, show, like, storeComment }

export default VideoController