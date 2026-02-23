import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ConversationController::index
 * @see app/Http/Controllers/ConversationController.php:15
 * @route '/messages'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConversationController::index
 * @see app/Http/Controllers/ConversationController.php:15
 * @route '/messages'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::index
 * @see app/Http/Controllers/ConversationController.php:15
 * @route '/messages'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConversationController::index
 * @see app/Http/Controllers/ConversationController.php:15
 * @route '/messages'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConversationController::index
 * @see app/Http/Controllers/ConversationController.php:15
 * @route '/messages'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConversationController::index
 * @see app/Http/Controllers/ConversationController.php:15
 * @route '/messages'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConversationController::index
 * @see app/Http/Controllers/ConversationController.php:15
 * @route '/messages'
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
* @see \App\Http\Controllers\ConversationController::show
 * @see app/Http/Controllers/ConversationController.php:30
 * @route '/messages/{conversation}'
 */
export const show = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/messages/{conversation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConversationController::show
 * @see app/Http/Controllers/ConversationController.php:30
 * @route '/messages/{conversation}'
 */
show.url = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return show.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::show
 * @see app/Http/Controllers/ConversationController.php:30
 * @route '/messages/{conversation}'
 */
show.get = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConversationController::show
 * @see app/Http/Controllers/ConversationController.php:30
 * @route '/messages/{conversation}'
 */
show.head = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConversationController::show
 * @see app/Http/Controllers/ConversationController.php:30
 * @route '/messages/{conversation}'
 */
    const showForm = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConversationController::show
 * @see app/Http/Controllers/ConversationController.php:30
 * @route '/messages/{conversation}'
 */
        showForm.get = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConversationController::show
 * @see app/Http/Controllers/ConversationController.php:30
 * @route '/messages/{conversation}'
 */
        showForm.head = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ConversationController::store
 * @see app/Http/Controllers/ConversationController.php:50
 * @route '/messages/{conversation}'
 */
export const store = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/messages/{conversation}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConversationController::store
 * @see app/Http/Controllers/ConversationController.php:50
 * @route '/messages/{conversation}'
 */
store.url = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return store.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::store
 * @see app/Http/Controllers/ConversationController.php:50
 * @route '/messages/{conversation}'
 */
store.post = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConversationController::store
 * @see app/Http/Controllers/ConversationController.php:50
 * @route '/messages/{conversation}'
 */
    const storeForm = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConversationController::store
 * @see app/Http/Controllers/ConversationController.php:50
 * @route '/messages/{conversation}'
 */
        storeForm.post = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ConversationController::contact
 * @see app/Http/Controllers/ConversationController.php:84
 * @route '/reservation/{reservation}/contact'
 */
export const contact = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(args, options),
    method: 'get',
})

contact.definition = {
    methods: ["get","head"],
    url: '/reservation/{reservation}/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConversationController::contact
 * @see app/Http/Controllers/ConversationController.php:84
 * @route '/reservation/{reservation}/contact'
 */
contact.url = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return contact.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::contact
 * @see app/Http/Controllers/ConversationController.php:84
 * @route '/reservation/{reservation}/contact'
 */
contact.get = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConversationController::contact
 * @see app/Http/Controllers/ConversationController.php:84
 * @route '/reservation/{reservation}/contact'
 */
contact.head = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contact.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConversationController::contact
 * @see app/Http/Controllers/ConversationController.php:84
 * @route '/reservation/{reservation}/contact'
 */
    const contactForm = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contact.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConversationController::contact
 * @see app/Http/Controllers/ConversationController.php:84
 * @route '/reservation/{reservation}/contact'
 */
        contactForm.get = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConversationController::contact
 * @see app/Http/Controllers/ConversationController.php:84
 * @route '/reservation/{reservation}/contact'
 */
        contactForm.head = (args: { reservation: string | { id: string } } | [reservation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contact.form = contactForm
const ConversationController = { index, show, store, contact }

export default ConversationController