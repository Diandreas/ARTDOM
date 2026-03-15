import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:22
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
* @see app/Http/Controllers/Artist/AlbumUploadController.php:22
* @route '/artist/albums'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:22
* @route '/artist/albums'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:22
* @route '/artist/albums'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:22
* @route '/artist/albums'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:22
* @route '/artist/albums'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::index
* @see app/Http/Controllers/Artist/AlbumUploadController.php:22
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
* @see app/Http/Controllers/Artist/AlbumUploadController.php:104
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
* @see app/Http/Controllers/Artist/AlbumUploadController.php:104
* @route '/artist/albums'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::store
* @see app/Http/Controllers/Artist/AlbumUploadController.php:104
* @route '/artist/albums'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::store
* @see app/Http/Controllers/Artist/AlbumUploadController.php:104
* @route '/artist/albums'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::store
* @see app/Http/Controllers/Artist/AlbumUploadController.php:104
* @route '/artist/albums'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::show
* @see app/Http/Controllers/Artist/AlbumUploadController.php:55
* @route '/artist/albums/{album}'
*/
export const show = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/artist/albums/{album}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::show
* @see app/Http/Controllers/Artist/AlbumUploadController.php:55
* @route '/artist/albums/{album}'
*/
show.url = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::show
* @see app/Http/Controllers/Artist/AlbumUploadController.php:55
* @route '/artist/albums/{album}'
*/
show.get = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::show
* @see app/Http/Controllers/Artist/AlbumUploadController.php:55
* @route '/artist/albums/{album}'
*/
show.head = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::show
* @see app/Http/Controllers/Artist/AlbumUploadController.php:55
* @route '/artist/albums/{album}'
*/
const showForm = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::show
* @see app/Http/Controllers/Artist/AlbumUploadController.php:55
* @route '/artist/albums/{album}'
*/
showForm.get = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::show
* @see app/Http/Controllers/Artist/AlbumUploadController.php:55
* @route '/artist/albums/{album}'
*/
showForm.head = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::update
* @see app/Http/Controllers/Artist/AlbumUploadController.php:130
* @route '/artist/albums/{album}'
*/
export const update = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/artist/albums/{album}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::update
* @see app/Http/Controllers/Artist/AlbumUploadController.php:130
* @route '/artist/albums/{album}'
*/
update.url = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::update
* @see app/Http/Controllers/Artist/AlbumUploadController.php:130
* @route '/artist/albums/{album}'
*/
update.put = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::update
* @see app/Http/Controllers/Artist/AlbumUploadController.php:130
* @route '/artist/albums/{album}'
*/
const updateForm = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::update
* @see app/Http/Controllers/Artist/AlbumUploadController.php:130
* @route '/artist/albums/{album}'
*/
updateForm.put = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::destroy
* @see app/Http/Controllers/Artist/AlbumUploadController.php:172
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
* @see app/Http/Controllers/Artist/AlbumUploadController.php:172
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
* @see app/Http/Controllers/Artist/AlbumUploadController.php:172
* @route '/artist/albums/{album}'
*/
destroy.delete = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::destroy
* @see app/Http/Controllers/Artist/AlbumUploadController.php:172
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
* @see app/Http/Controllers/Artist/AlbumUploadController.php:172
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
* @see \App\Http\Controllers\Artist\AlbumUploadController::togglePublication
* @see app/Http/Controllers/Artist/AlbumUploadController.php:196
* @route '/artist/albums/{album}/toggle-publication'
*/
export const togglePublication = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: togglePublication.url(args, options),
    method: 'patch',
})

togglePublication.definition = {
    methods: ["patch"],
    url: '/artist/albums/{album}/toggle-publication',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::togglePublication
* @see app/Http/Controllers/Artist/AlbumUploadController.php:196
* @route '/artist/albums/{album}/toggle-publication'
*/
togglePublication.url = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return togglePublication.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::togglePublication
* @see app/Http/Controllers/Artist/AlbumUploadController.php:196
* @route '/artist/albums/{album}/toggle-publication'
*/
togglePublication.patch = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: togglePublication.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::togglePublication
* @see app/Http/Controllers/Artist/AlbumUploadController.php:196
* @route '/artist/albums/{album}/toggle-publication'
*/
const togglePublicationForm = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: togglePublication.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::togglePublication
* @see app/Http/Controllers/Artist/AlbumUploadController.php:196
* @route '/artist/albums/{album}/toggle-publication'
*/
togglePublicationForm.patch = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: togglePublication.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

togglePublication.form = togglePublicationForm

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::addTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:216
* @route '/artist/albums/{album}/tracks'
*/
export const addTrack = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addTrack.url(args, options),
    method: 'post',
})

addTrack.definition = {
    methods: ["post"],
    url: '/artist/albums/{album}/tracks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::addTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:216
* @route '/artist/albums/{album}/tracks'
*/
addTrack.url = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return addTrack.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::addTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:216
* @route '/artist/albums/{album}/tracks'
*/
addTrack.post = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addTrack.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::addTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:216
* @route '/artist/albums/{album}/tracks'
*/
const addTrackForm = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addTrack.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::addTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:216
* @route '/artist/albums/{album}/tracks'
*/
addTrackForm.post = (args: { album: string | { id: string } } | [album: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addTrack.url(args, options),
    method: 'post',
})

addTrack.form = addTrackForm

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::removeTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:252
* @route '/artist/albums/{album}/tracks/{track}'
*/
export const removeTrack = (args: { album: string | { id: string }, track: string | { id: string } } | [album: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeTrack.url(args, options),
    method: 'delete',
})

removeTrack.definition = {
    methods: ["delete"],
    url: '/artist/albums/{album}/tracks/{track}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::removeTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:252
* @route '/artist/albums/{album}/tracks/{track}'
*/
removeTrack.url = (args: { album: string | { id: string }, track: string | { id: string } } | [album: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            album: args[0],
            track: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        album: typeof args.album === 'object'
        ? args.album.id
        : args.album,
        track: typeof args.track === 'object'
        ? args.track.id
        : args.track,
    }

    return removeTrack.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace('{track}', parsedArgs.track.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::removeTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:252
* @route '/artist/albums/{album}/tracks/{track}'
*/
removeTrack.delete = (args: { album: string | { id: string }, track: string | { id: string } } | [album: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeTrack.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::removeTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:252
* @route '/artist/albums/{album}/tracks/{track}'
*/
const removeTrackForm = (args: { album: string | { id: string }, track: string | { id: string } } | [album: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeTrack.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Artist\AlbumUploadController::removeTrack
* @see app/Http/Controllers/Artist/AlbumUploadController.php:252
* @route '/artist/albums/{album}/tracks/{track}'
*/
removeTrackForm.delete = (args: { album: string | { id: string }, track: string | { id: string } } | [album: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeTrack.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeTrack.form = removeTrackForm

const AlbumUploadController = { index, store, show, update, destroy, togglePublication, addTrack, removeTrack }

export default AlbumUploadController