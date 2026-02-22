import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\ProfileController::show
 * @see app/Http/Controllers/Artist/ProfileController.php:31
 * @route '/artist/profile'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/artist/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\ProfileController::show
 * @see app/Http/Controllers/Artist/ProfileController.php:31
 * @route '/artist/profile'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::show
 * @see app/Http/Controllers/Artist/ProfileController.php:31
 * @route '/artist/profile'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\ProfileController::show
 * @see app/Http/Controllers/Artist/ProfileController.php:31
 * @route '/artist/profile'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Artist\ProfileController::update
 * @see app/Http/Controllers/Artist/ProfileController.php:86
 * @route '/artist/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/artist/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Artist\ProfileController::update
 * @see app/Http/Controllers/Artist/ProfileController.php:86
 * @route '/artist/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::update
 * @see app/Http/Controllers/Artist/ProfileController.php:86
 * @route '/artist/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Artist\ProfileController::uploadMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:123
 * @route '/artist/profile/media'
 */
export const uploadMedia = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMedia.url(options),
    method: 'post',
})

uploadMedia.definition = {
    methods: ["post"],
    url: '/artist/profile/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\ProfileController::uploadMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:123
 * @route '/artist/profile/media'
 */
uploadMedia.url = (options?: RouteQueryOptions) => {
    return uploadMedia.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::uploadMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:123
 * @route '/artist/profile/media'
 */
uploadMedia.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMedia.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media/{media}'
 */
export const deleteMedia = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMedia.url(args, options),
    method: 'delete',
})

deleteMedia.definition = {
    methods: ["delete"],
    url: '/artist/profile/media/{media}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media/{media}'
 */
deleteMedia.url = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteMedia.definition.url
            .replace('{media}', parsedArgs.media.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media/{media}'
 */
deleteMedia.delete = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMedia.url(args, options),
    method: 'delete',
})
const ProfileController = { show, update, uploadMedia, deleteMedia }

export default ProfileController