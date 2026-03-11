import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Artist\ProfileController::show
 * @see app/Http/Controllers/Artist/ProfileController.php:31
 * @route '/artist/profile'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\ProfileController::show
 * @see app/Http/Controllers/Artist/ProfileController.php:31
 * @route '/artist/profile'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\ProfileController::show
 * @see app/Http/Controllers/Artist/ProfileController.php:31
 * @route '/artist/profile'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
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
* @see \App\Http\Controllers\Artist\ProfileController::update
 * @see app/Http/Controllers/Artist/ProfileController.php:86
 * @route '/artist/profile'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ProfileController::update
 * @see app/Http/Controllers/Artist/ProfileController.php:86
 * @route '/artist/profile'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Artist\ProfileController::uploadAvatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
export const uploadAvatar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(options),
    method: 'post',
})

uploadAvatar.definition = {
    methods: ["post"],
    url: '/artist/profile/avatar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\ProfileController::uploadAvatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
uploadAvatar.url = (options?: RouteQueryOptions) => {
    return uploadAvatar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::uploadAvatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
uploadAvatar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\ProfileController::uploadAvatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
    const uploadAvatarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadAvatar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ProfileController::uploadAvatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
        uploadAvatarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadAvatar.url(options),
            method: 'post',
        })
    
    uploadAvatar.form = uploadAvatarForm
/**
* @see \App\Http\Controllers\Artist\ProfileController::uploadMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:153
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
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media'
 */
uploadMedia.url = (options?: RouteQueryOptions) => {
    return uploadMedia.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::uploadMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media'
 */
uploadMedia.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMedia.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\ProfileController::uploadMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media'
 */
    const uploadMediaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadMedia.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ProfileController::uploadMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media'
 */
        uploadMediaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadMedia.url(options),
            method: 'post',
        })
    
    uploadMedia.form = uploadMediaForm
/**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:183
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
 * @see app/Http/Controllers/Artist/ProfileController.php:183
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
 * @see app/Http/Controllers/Artist/ProfileController.php:183
 * @route '/artist/profile/media/{media}'
 */
deleteMedia.delete = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMedia.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:183
 * @route '/artist/profile/media/{media}'
 */
    const deleteMediaForm = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMedia.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ProfileController::deleteMedia
 * @see app/Http/Controllers/Artist/ProfileController.php:183
 * @route '/artist/profile/media/{media}'
 */
        deleteMediaForm.delete = (args: { media: string | number } | [media: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMedia.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMedia.form = deleteMediaForm
const ProfileController = { show, update, uploadAvatar, uploadMedia, deleteMedia }

export default ProfileController