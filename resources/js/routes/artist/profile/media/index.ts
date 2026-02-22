import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\ProfileController::upload
 * @see app/Http/Controllers/Artist/ProfileController.php:123
 * @route '/artist/profile/media'
 */
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/artist/profile/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\ProfileController::upload
 * @see app/Http/Controllers/Artist/ProfileController.php:123
 * @route '/artist/profile/media'
 */
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::upload
 * @see app/Http/Controllers/Artist/ProfileController.php:123
 * @route '/artist/profile/media'
 */
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMethod
 * @see app/Http/Controllers/Artist/ProfileController.php:153
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
 * @see app/Http/Controllers/Artist/ProfileController.php:153
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
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media/{media}'
 */
deleteMethod.delete = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})
const media = {
    upload: Object.assign(upload, upload),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default media