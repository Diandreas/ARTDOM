import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolve
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
export const resolve = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

resolve.definition = {
    methods: ["post"],
    url: '/admin/moderation/reviews/{review}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolve
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
resolve.url = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return resolve.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolve
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
resolve.post = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolve
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
const resolveForm = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::resolve
* @see app/Http/Controllers/Admin/ContentModerationController.php:48
* @route '/admin/moderation/reviews/{review}/resolve'
*/
resolveForm.post = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

resolve.form = resolveForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteMethod
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
export const deleteMethod = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/admin/moderation/reviews/{review}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteMethod
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
deleteMethod.url = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return deleteMethod.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteMethod
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
deleteMethod.delete = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteMethod
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
const deleteMethodForm = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::deleteMethod
* @see app/Http/Controllers/Admin/ContentModerationController.php:58
* @route '/admin/moderation/reviews/{review}'
*/
deleteMethodForm.delete = (args: { review: string | { id: string } } | [review: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteMethod.form = deleteMethodForm

const reviews = {
    resolve: Object.assign(resolve, resolve),
    delete: Object.assign(deleteMethod, deleteMethod),
}

export default reviews