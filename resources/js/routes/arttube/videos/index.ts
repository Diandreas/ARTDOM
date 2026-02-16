import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\Stream\VideoController::comments
 * @see app/Http/Controllers/Stream/VideoController.php:132
 * @route '/arttube/videos/{video}/comments'
 */
export const comments = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: comments.url(args, options),
    method: 'post',
})

comments.definition = {
    methods: ["post"],
    url: '/arttube/videos/{video}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Stream\VideoController::comments
 * @see app/Http/Controllers/Stream/VideoController.php:132
 * @route '/arttube/videos/{video}/comments'
 */
comments.url = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return comments.definition.url
            .replace('{video}', parsedArgs.video.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Stream\VideoController::comments
 * @see app/Http/Controllers/Stream/VideoController.php:132
 * @route '/arttube/videos/{video}/comments'
 */
comments.post = (args: { video: string | { id: string } } | [video: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: comments.url(args, options),
    method: 'post',
})
const videos = {
    show: Object.assign(show, show),
like: Object.assign(like, like),
comments: Object.assign(comments, comments),
}

export default videos