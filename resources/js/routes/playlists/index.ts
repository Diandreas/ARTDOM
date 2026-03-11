import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PlaylistController::index
* @see app/Http/Controllers/PlaylistController.php:14
* @route '/playlists'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/playlists',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlaylistController::index
* @see app/Http/Controllers/PlaylistController.php:14
* @route '/playlists'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlaylistController::index
* @see app/Http/Controllers/PlaylistController.php:14
* @route '/playlists'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlaylistController::index
* @see app/Http/Controllers/PlaylistController.php:14
* @route '/playlists'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlaylistController::index
* @see app/Http/Controllers/PlaylistController.php:14
* @route '/playlists'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlaylistController::index
* @see app/Http/Controllers/PlaylistController.php:14
* @route '/playlists'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlaylistController::index
* @see app/Http/Controllers/PlaylistController.php:14
* @route '/playlists'
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
* @see \App\Http\Controllers\PlaylistController::store
* @see app/Http/Controllers/PlaylistController.php:38
* @route '/playlists'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/playlists',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlaylistController::store
* @see app/Http/Controllers/PlaylistController.php:38
* @route '/playlists'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlaylistController::store
* @see app/Http/Controllers/PlaylistController.php:38
* @route '/playlists'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlaylistController::store
* @see app/Http/Controllers/PlaylistController.php:38
* @route '/playlists'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlaylistController::store
* @see app/Http/Controllers/PlaylistController.php:38
* @route '/playlists'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PlaylistController::show
* @see app/Http/Controllers/PlaylistController.php:59
* @route '/playlists/{playlist}'
*/
export const show = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/playlists/{playlist}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlaylistController::show
* @see app/Http/Controllers/PlaylistController.php:59
* @route '/playlists/{playlist}'
*/
show.url = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { playlist: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { playlist: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            playlist: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        playlist: typeof args.playlist === 'object'
        ? args.playlist.id
        : args.playlist,
    }

    return show.definition.url
            .replace('{playlist}', parsedArgs.playlist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlaylistController::show
* @see app/Http/Controllers/PlaylistController.php:59
* @route '/playlists/{playlist}'
*/
show.get = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlaylistController::show
* @see app/Http/Controllers/PlaylistController.php:59
* @route '/playlists/{playlist}'
*/
show.head = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlaylistController::show
* @see app/Http/Controllers/PlaylistController.php:59
* @route '/playlists/{playlist}'
*/
const showForm = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlaylistController::show
* @see app/Http/Controllers/PlaylistController.php:59
* @route '/playlists/{playlist}'
*/
showForm.get = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlaylistController::show
* @see app/Http/Controllers/PlaylistController.php:59
* @route '/playlists/{playlist}'
*/
showForm.head = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PlaylistController::destroy
* @see app/Http/Controllers/PlaylistController.php:129
* @route '/playlists/{playlist}'
*/
export const destroy = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/playlists/{playlist}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PlaylistController::destroy
* @see app/Http/Controllers/PlaylistController.php:129
* @route '/playlists/{playlist}'
*/
destroy.url = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { playlist: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { playlist: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            playlist: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        playlist: typeof args.playlist === 'object'
        ? args.playlist.id
        : args.playlist,
    }

    return destroy.definition.url
            .replace('{playlist}', parsedArgs.playlist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlaylistController::destroy
* @see app/Http/Controllers/PlaylistController.php:129
* @route '/playlists/{playlist}'
*/
destroy.delete = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PlaylistController::destroy
* @see app/Http/Controllers/PlaylistController.php:129
* @route '/playlists/{playlist}'
*/
const destroyForm = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlaylistController::destroy
* @see app/Http/Controllers/PlaylistController.php:129
* @route '/playlists/{playlist}'
*/
destroyForm.delete = (args: { playlist: string | { id: string } } | [playlist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PlaylistController::addTrack
* @see app/Http/Controllers/PlaylistController.php:93
* @route '/playlists/{playlist}/tracks/{track}'
*/
export const addTrack = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addTrack.url(args, options),
    method: 'post',
})

addTrack.definition = {
    methods: ["post"],
    url: '/playlists/{playlist}/tracks/{track}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlaylistController::addTrack
* @see app/Http/Controllers/PlaylistController.php:93
* @route '/playlists/{playlist}/tracks/{track}'
*/
addTrack.url = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            playlist: args[0],
            track: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        playlist: typeof args.playlist === 'object'
        ? args.playlist.id
        : args.playlist,
        track: typeof args.track === 'object'
        ? args.track.id
        : args.track,
    }

    return addTrack.definition.url
            .replace('{playlist}', parsedArgs.playlist.toString())
            .replace('{track}', parsedArgs.track.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlaylistController::addTrack
* @see app/Http/Controllers/PlaylistController.php:93
* @route '/playlists/{playlist}/tracks/{track}'
*/
addTrack.post = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addTrack.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlaylistController::addTrack
* @see app/Http/Controllers/PlaylistController.php:93
* @route '/playlists/{playlist}/tracks/{track}'
*/
const addTrackForm = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addTrack.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlaylistController::addTrack
* @see app/Http/Controllers/PlaylistController.php:93
* @route '/playlists/{playlist}/tracks/{track}'
*/
addTrackForm.post = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addTrack.url(args, options),
    method: 'post',
})

addTrack.form = addTrackForm

/**
* @see \App\Http\Controllers\PlaylistController::removeTrack
* @see app/Http/Controllers/PlaylistController.php:117
* @route '/playlists/{playlist}/tracks/{track}'
*/
export const removeTrack = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeTrack.url(args, options),
    method: 'delete',
})

removeTrack.definition = {
    methods: ["delete"],
    url: '/playlists/{playlist}/tracks/{track}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PlaylistController::removeTrack
* @see app/Http/Controllers/PlaylistController.php:117
* @route '/playlists/{playlist}/tracks/{track}'
*/
removeTrack.url = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            playlist: args[0],
            track: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        playlist: typeof args.playlist === 'object'
        ? args.playlist.id
        : args.playlist,
        track: typeof args.track === 'object'
        ? args.track.id
        : args.track,
    }

    return removeTrack.definition.url
            .replace('{playlist}', parsedArgs.playlist.toString())
            .replace('{track}', parsedArgs.track.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlaylistController::removeTrack
* @see app/Http/Controllers/PlaylistController.php:117
* @route '/playlists/{playlist}/tracks/{track}'
*/
removeTrack.delete = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeTrack.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PlaylistController::removeTrack
* @see app/Http/Controllers/PlaylistController.php:117
* @route '/playlists/{playlist}/tracks/{track}'
*/
const removeTrackForm = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeTrack.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlaylistController::removeTrack
* @see app/Http/Controllers/PlaylistController.php:117
* @route '/playlists/{playlist}/tracks/{track}'
*/
removeTrackForm.delete = (args: { playlist: string | { id: string }, track: string | { id: string } } | [playlist: string | { id: string }, track: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeTrack.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeTrack.form = removeTrackForm

const playlists = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    destroy: Object.assign(destroy, destroy),
    addTrack: Object.assign(addTrack, addTrack),
    removeTrack: Object.assign(removeTrack, removeTrack),
}

export default playlists