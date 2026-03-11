import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\SubscriptionController::index
 * @see app/Http/Controllers/Artist/SubscriptionController.php:19
 * @route '/artist/subscription'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artist/subscription',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\SubscriptionController::index
 * @see app/Http/Controllers/Artist/SubscriptionController.php:19
 * @route '/artist/subscription'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\SubscriptionController::index
 * @see app/Http/Controllers/Artist/SubscriptionController.php:19
 * @route '/artist/subscription'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\SubscriptionController::index
 * @see app/Http/Controllers/Artist/SubscriptionController.php:19
 * @route '/artist/subscription'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\SubscriptionController::index
 * @see app/Http/Controllers/Artist/SubscriptionController.php:19
 * @route '/artist/subscription'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\SubscriptionController::index
 * @see app/Http/Controllers/Artist/SubscriptionController.php:19
 * @route '/artist/subscription'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\SubscriptionController::index
 * @see app/Http/Controllers/Artist/SubscriptionController.php:19
 * @route '/artist/subscription'
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
* @see \App\Http\Controllers\Artist\SubscriptionController::checkout
 * @see app/Http/Controllers/Artist/SubscriptionController.php:69
 * @route '/artist/subscription/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/artist/subscription/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\SubscriptionController::checkout
 * @see app/Http/Controllers/Artist/SubscriptionController.php:69
 * @route '/artist/subscription/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\SubscriptionController::checkout
 * @see app/Http/Controllers/Artist/SubscriptionController.php:69
 * @route '/artist/subscription/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\SubscriptionController::checkout
 * @see app/Http/Controllers/Artist/SubscriptionController.php:69
 * @route '/artist/subscription/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\SubscriptionController::checkout
 * @see app/Http/Controllers/Artist/SubscriptionController.php:69
 * @route '/artist/subscription/checkout'
 */
        checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
/**
* @see \App\Http\Controllers\Artist\SubscriptionController::cancel
 * @see app/Http/Controllers/Artist/SubscriptionController.php:91
 * @route '/artist/subscription/cancel'
 */
export const cancel = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/artist/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\SubscriptionController::cancel
 * @see app/Http/Controllers/Artist/SubscriptionController.php:91
 * @route '/artist/subscription/cancel'
 */
cancel.url = (options?: RouteQueryOptions) => {
    return cancel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\SubscriptionController::cancel
 * @see app/Http/Controllers/Artist/SubscriptionController.php:91
 * @route '/artist/subscription/cancel'
 */
cancel.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\SubscriptionController::cancel
 * @see app/Http/Controllers/Artist/SubscriptionController.php:91
 * @route '/artist/subscription/cancel'
 */
    const cancelForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\SubscriptionController::cancel
 * @see app/Http/Controllers/Artist/SubscriptionController.php:91
 * @route '/artist/subscription/cancel'
 */
        cancelForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\Artist\SubscriptionController::resume
 * @see app/Http/Controllers/Artist/SubscriptionController.php:108
 * @route '/artist/subscription/resume'
 */
export const resume = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(options),
    method: 'post',
})

resume.definition = {
    methods: ["post"],
    url: '/artist/subscription/resume',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\SubscriptionController::resume
 * @see app/Http/Controllers/Artist/SubscriptionController.php:108
 * @route '/artist/subscription/resume'
 */
resume.url = (options?: RouteQueryOptions) => {
    return resume.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\SubscriptionController::resume
 * @see app/Http/Controllers/Artist/SubscriptionController.php:108
 * @route '/artist/subscription/resume'
 */
resume.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\SubscriptionController::resume
 * @see app/Http/Controllers/Artist/SubscriptionController.php:108
 * @route '/artist/subscription/resume'
 */
    const resumeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resume.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\SubscriptionController::resume
 * @see app/Http/Controllers/Artist/SubscriptionController.php:108
 * @route '/artist/subscription/resume'
 */
        resumeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resume.url(options),
            method: 'post',
        })
    
    resume.form = resumeForm
const subscription = {
    index: Object.assign(index, index),
checkout: Object.assign(checkout, checkout),
cancel: Object.assign(cancel, cancel),
resume: Object.assign(resume, resume),
}

export default subscription