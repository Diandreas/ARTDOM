import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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

const reservation = {
    contact: Object.assign(contact, contact),
}

export default reservation