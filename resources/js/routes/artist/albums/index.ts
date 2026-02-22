import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:19
* @route '/artist/albums'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artist/albums',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:19
* @route '/artist/albums'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:19
* @route '/artist/albums'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:19
* @route '/artist/albums'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:19
* @route '/artist/albums'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:19
* @route '/artist/albums'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:19
* @route '/artist/albums'
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
* @see \App\Http\Controllers\Artist\AlbumUploadController::store
* @see app/Http/Controllers/Artist/AlbumUploadController.php:52
* @route '/artist/albums'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/artist/albums',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::store
* @see app/Http/Controllers/Artist/AlbumUploadController.php:52
* @route '/artist/albums'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::store
* @see app/Http/Controllers/Artist/AlbumUploadController.php:52
* @route '/artist/albums'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::store
* @see app/Http/Controllers/Artist/AlbumUploadController.php:52
* @route '/artist/albums'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::store
* @see app/Http/Controllers/Artist/AlbumUploadController.php:52
* @route '/artist/albums'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::destroy
* @see app/Http/Controllers/Artist/AlbumUploadController.php:80
* @route '/artist/albums/{album}'
*/
export const destroy = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/artist/albums/{album}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::destroy
* @see app/Http/Controllers/Artist/AlbumUploadController.php:80
* @route '/artist/albums/{album}'
*/
destroy.url = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { album: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { album: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            album: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        album: typeof args.album === 'object'
        ? args.album.id
        : args.album,
    }

    return destroy.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::destroy
* @see app/Http/Controllers/Artist/AlbumUploadController.php:80
* @route '/artist/albums/{album}'
*/
destroy.delete = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::destroy
* @see app/Http/Controllers/Artist/AlbumUploadController.php:80
* @route '/artist/albums/{album}'
*/
const destroyForm = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::destroy
* @see app/Http/Controllers/Artist/AlbumUploadController.php:80
* @route '/artist/albums/{album}'
*/
destroyForm.delete = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::toggle
* @see app/Http/Controllers/Artist/AlbumUploadController.php:107
* @route '/artist/albums/{album}/toggle-publication'
*/
export const toggle = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/artist/albums/{album}/toggle-publication',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::toggle
* @see app/Http/Controllers/Artist/AlbumUploadController.php:107
* @route '/artist/albums/{album}/toggle-publication'
*/
toggle.url = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { album: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { album: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            album: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        album: typeof args.album === 'object'
        ? args.album.id
        : args.album,
    }

    return toggle.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::toggle
* @see app/Http/Controllers/Artist/AlbumUploadController.php:107
* @route '/artist/albums/{album}/toggle-publication'
*/
toggle.patch = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::toggle
* @see app/Http/Controllers/Artist/AlbumUploadController.php:107
* @route '/artist/albums/{album}/toggle-publication'
*/
const toggleForm = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::toggle
* @see app/Http/Controllers/Artist/AlbumUploadController.php:107
* @route '/artist/albums/{album}/toggle-publication'
*/
toggleForm.patch = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggle.form = toggleForm

const albums = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
    toggle: Object.assign(toggle, toggle),
}

export default albums