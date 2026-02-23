import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::pending
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:23
 * @route '/admin/artists/pending'
 */
export const pending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pending.url(options),
    method: 'get',
})

pending.definition = {
    methods: ["get","head"],
    url: '/admin/artists/pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::pending
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:23
 * @route '/admin/artists/pending'
 */
pending.url = (options?: RouteQueryOptions) => {
    return pending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::pending
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:23
 * @route '/admin/artists/pending'
 */
pending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pending.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::pending
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:23
 * @route '/admin/artists/pending'
 */
pending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pending.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ArtistValidationController::pending
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:23
 * @route '/admin/artists/pending'
 */
    const pendingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pending.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ArtistValidationController::pending
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:23
 * @route '/admin/artists/pending'
 */
        pendingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pending.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ArtistValidationController::pending
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:23
 * @route '/admin/artists/pending'
 */
        pendingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pending.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pending.form = pendingForm
/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::approve
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:79
 * @route '/admin/artists/{artist}/approve'
 */
export const approve = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/artists/{artist}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::approve
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:79
 * @route '/admin/artists/{artist}/approve'
 */
approve.url = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { artist: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { artist: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    artist: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        artist: typeof args.artist === 'object'
                ? args.artist.id
                : args.artist,
                }

    return approve.definition.url
            .replace('{artist}', parsedArgs.artist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::approve
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:79
 * @route '/admin/artists/{artist}/approve'
 */
approve.post = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ArtistValidationController::approve
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:79
 * @route '/admin/artists/{artist}/approve'
 */
    const approveForm = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ArtistValidationController::approve
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:79
 * @route '/admin/artists/{artist}/approve'
 */
        approveForm.post = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::reject
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:108
 * @route '/admin/artists/{artist}/reject'
 */
export const reject = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/artists/{artist}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::reject
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:108
 * @route '/admin/artists/{artist}/reject'
 */
reject.url = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { artist: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { artist: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    artist: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        artist: typeof args.artist === 'object'
                ? args.artist.id
                : args.artist,
                }

    return reject.definition.url
            .replace('{artist}', parsedArgs.artist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ArtistValidationController::reject
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:108
 * @route '/admin/artists/{artist}/reject'
 */
reject.post = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ArtistValidationController::reject
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:108
 * @route '/admin/artists/{artist}/reject'
 */
    const rejectForm = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ArtistValidationController::reject
 * @see app/Http/Controllers/Admin/ArtistValidationController.php:108
 * @route '/admin/artists/{artist}/reject'
 */
        rejectForm.post = (args: { artist: string | { id: string } } | [artist: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const artists = {
    pending: Object.assign(pending, pending),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
}

export default artists