import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import media30b75d from './media'
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
* @see \App\Http\Controllers\Artist\ProfileController::avatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
export const avatar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: avatar.url(options),
    method: 'post',
})

avatar.definition = {
    methods: ["post"],
    url: '/artist/profile/avatar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\ProfileController::avatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
avatar.url = (options?: RouteQueryOptions) => {
    return avatar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::avatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
avatar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: avatar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\ProfileController::avatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
    const avatarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: avatar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ProfileController::avatar
 * @see app/Http/Controllers/Artist/ProfileController.php:121
 * @route '/artist/profile/avatar'
 */
        avatarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: avatar.url(options),
            method: 'post',
        })
    
    avatar.form = avatarForm
/**
* @see \App\Http\Controllers\Artist\ProfileController::media
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media'
 */
export const media = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: media.url(options),
    method: 'post',
})

media.definition = {
    methods: ["post"],
    url: '/artist/profile/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\ProfileController::media
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media'
 */
media.url = (options?: RouteQueryOptions) => {
    return media.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\ProfileController::media
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media'
 */
media.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: media.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\ProfileController::media
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media'
 */
    const mediaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: media.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\ProfileController::media
 * @see app/Http/Controllers/Artist/ProfileController.php:153
 * @route '/artist/profile/media'
 */
        mediaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: media.url(options),
            method: 'post',
        })
    
    media.form = mediaForm
const profile = {
    show: Object.assign(show, show),
update: Object.assign(update, update),
avatar: Object.assign(avatar, avatar),
media: Object.assign(media, media30b75d),
}

export default profile