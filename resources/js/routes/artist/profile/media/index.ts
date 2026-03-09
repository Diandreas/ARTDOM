import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMethod
 * @see app/Http/Controllers/Artist/ProfileController.php:183
 * @route '/artist/profile/media/{media}'
 */
export const deleteMethod = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/artist/profile/media/{media}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMethod
 * @see app/Http/Controllers/Artist/ProfileController.php:183
 * @route '/artist/profile/media/{media}'
 */
deleteMethod.url = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    media: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        media: args.media,
                }

    return deleteMethod.definition.url
            .replace('{media}', parsedArgs.media.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMethod
 * @see app/Http/Controllers/Artist/ProfileController.php:183
 * @route '/artist/profile/media/{media}'
 */
deleteMethod.delete = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMethod
 * @see app/Http/Controllers/Artist/ProfileController.php:183
 * @route '/artist/profile/media/{media}'
 */
    const deleteMethodForm = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMethod
 * @see app/Http/Controllers/Artist/ProfileController.php:183
 * @route '/artist/profile/media/{media}'
 */
        deleteMethodForm.delete = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const media = {
    delete: Object.assign(deleteMethod, deleteMethod),
}

export default media