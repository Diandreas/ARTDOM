import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import media from './media'
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

const profile = {
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    media: Object.assign(media, media),
}

export default profile