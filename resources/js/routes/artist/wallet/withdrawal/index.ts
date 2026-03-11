import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\WalletController::show
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
export const show = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/artist/wallet/withdrawals/{withdrawal}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\WalletController::show
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
show.url = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { withdrawal: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { withdrawal: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    withdrawal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        withdrawal: typeof args.withdrawal === 'object'
                ? args.withdrawal.id
                : args.withdrawal,
                }

    return show.definition.url
            .replace('{withdrawal}', parsedArgs.withdrawal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\WalletController::show
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
show.get = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\WalletController::show
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
show.head = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\WalletController::show
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
    const showForm = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\WalletController::show
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
        showForm.get = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\WalletController::show
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
        showForm.head = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const withdrawal = {
    show: Object.assign(show, show),
}

export default withdrawal