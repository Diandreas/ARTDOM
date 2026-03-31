import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ContentModerationController::index
* @see app/Http/Controllers/Admin/ContentModerationController.php:14
* @route '/admin/moderation'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/moderation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::index
* @see app/Http/Controllers/Admin/ContentModerationController.php:14
* @route '/admin/moderation'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::index
* @see app/Http/Controllers/Admin/ContentModerationController.php:14
* @route '/admin/moderation'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::index
* @see app/Http/Controllers/Admin/ContentModerationController.php:14
* @route '/admin/moderation'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::index
* @see app/Http/Controllers/Admin/ContentModerationController.php:14
* @route '/admin/moderation'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::index
* @see app/Http/Controllers/Admin/ContentModerationController.php:14
* @route '/admin/moderation'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::index
* @see app/Http/Controllers/Admin/ContentModerationController.php:14
* @route '/admin/moderation'
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

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
export const resolveReview = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveReview.url(args, options),
    method: 'post',
})

resolveReview.definition = {
    methods: ["post"],
    url: '/admin/moderation/reviews/{review}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
resolveReview.url = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { review: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { review: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            review: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        review: typeof args.review === 'object'
        ? args.review.id
        : args.review,
    }

    return resolveReview.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
resolveReview.post = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveReview.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
const resolveReviewForm = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveReview.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
resolveReviewForm.post = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveReview.url(args, options),
    method: 'post',
})

resolveReview.form = resolveReviewForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
export const deleteReview = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteReview.url(args, options),
    method: 'delete',
})

deleteReview.definition = {
    methods: ["delete"],
    url: '/admin/moderation/reviews/{review}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
deleteReview.url = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { review: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { review: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            review: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        review: typeof args.review === 'object'
        ? args.review.id
        : args.review,
    }

    return deleteReview.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
deleteReview.delete = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteReview.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
const deleteReviewForm = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteReview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteReview
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
deleteReviewForm.delete = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteReview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteReview.form = deleteReviewForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:65
* @route '/admin/moderation/comments/{comment}/resolve'
*/
export const resolveComment = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveComment.url(args, options),
    method: 'post',
})

resolveComment.definition = {
    methods: ["post"],
    url: '/admin/moderation/comments/{comment}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:65
* @route '/admin/moderation/comments/{comment}/resolve'
*/
resolveComment.url = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { comment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { comment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            comment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return resolveComment.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:65
* @route '/admin/moderation/comments/{comment}/resolve'
*/
resolveComment.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:65
* @route '/admin/moderation/comments/{comment}/resolve'
*/
const resolveCommentForm = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolveComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:65
* @route '/admin/moderation/comments/{comment}/resolve'
*/
resolveCommentForm.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveComment.url(args, options),
    method: 'post',
})

resolveComment.form = resolveCommentForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:74
* @route '/admin/moderation/comments/{comment}'
*/
export const deleteComment = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteComment.url(args, options),
    method: 'delete',
})

deleteComment.definition = {
    methods: ["delete"],
    url: '/admin/moderation/comments/{comment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:74
* @route '/admin/moderation/comments/{comment}'
*/
deleteComment.url = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { comment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { comment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            comment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return deleteComment.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:74
* @route '/admin/moderation/comments/{comment}'
*/
deleteComment.delete = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteComment.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:74
* @route '/admin/moderation/comments/{comment}'
*/
const deleteCommentForm = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteComment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteComment
* @see app/Http/Controllers/Admin/ContentModerationController.php:74
* @route '/admin/moderation/comments/{comment}'
*/
deleteCommentForm.delete = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteComment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteComment.form = deleteCommentForm

const ContentModerationController = { index, resolveReview, deleteReview, resolveComment, deleteComment }

export default ContentModerationController