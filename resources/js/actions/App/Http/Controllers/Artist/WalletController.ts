import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Artist\WalletController::index
 * @see app/Http/Controllers/Artist/WalletController.php:31
 * @route '/artist/wallet'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/artist/wallet',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\WalletController::index
 * @see app/Http/Controllers/Artist/WalletController.php:31
 * @route '/artist/wallet'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\WalletController::index
 * @see app/Http/Controllers/Artist/WalletController.php:31
 * @route '/artist/wallet'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\WalletController::index
 * @see app/Http/Controllers/Artist/WalletController.php:31
 * @route '/artist/wallet'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\WalletController::index
 * @see app/Http/Controllers/Artist/WalletController.php:31
 * @route '/artist/wallet'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\WalletController::index
 * @see app/Http/Controllers/Artist/WalletController.php:31
 * @route '/artist/wallet'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\WalletController::index
 * @see app/Http/Controllers/Artist/WalletController.php:31
 * @route '/artist/wallet'
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
* @see \App\Http\Controllers\Artist\WalletController::transactions
 * @see app/Http/Controllers/Artist/WalletController.php:67
 * @route '/artist/wallet/transactions'
 */
export const transactions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

transactions.definition = {
    methods: ["get","head"],
    url: '/artist/wallet/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\WalletController::transactions
 * @see app/Http/Controllers/Artist/WalletController.php:67
 * @route '/artist/wallet/transactions'
 */
transactions.url = (options?: RouteQueryOptions) => {
    return transactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\WalletController::transactions
 * @see app/Http/Controllers/Artist/WalletController.php:67
 * @route '/artist/wallet/transactions'
 */
transactions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\WalletController::transactions
 * @see app/Http/Controllers/Artist/WalletController.php:67
 * @route '/artist/wallet/transactions'
 */
transactions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transactions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\WalletController::transactions
 * @see app/Http/Controllers/Artist/WalletController.php:67
 * @route '/artist/wallet/transactions'
 */
    const transactionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: transactions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\WalletController::transactions
 * @see app/Http/Controllers/Artist/WalletController.php:67
 * @route '/artist/wallet/transactions'
 */
        transactionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transactions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\WalletController::transactions
 * @see app/Http/Controllers/Artist/WalletController.php:67
 * @route '/artist/wallet/transactions'
 */
        transactionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transactions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    transactions.form = transactionsForm
/**
* @see \App\Http\Controllers\Artist\WalletController::exportCsv
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/artist/wallet/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\WalletController::exportCsv
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\WalletController::exportCsv
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\WalletController::exportCsv
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\WalletController::exportCsv
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
    const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\WalletController::exportCsv
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
        exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\WalletController::exportCsv
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
        exportCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportCsv.form = exportCsvForm
/**
* @see \App\Http\Controllers\Artist\WalletController::withdraw
 * @see app/Http/Controllers/Artist/WalletController.php:165
 * @route '/artist/wallet/withdraw'
 */
export const withdraw = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: withdraw.url(options),
    method: 'post',
})

withdraw.definition = {
    methods: ["post"],
    url: '/artist/wallet/withdraw',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Artist\WalletController::withdraw
 * @see app/Http/Controllers/Artist/WalletController.php:165
 * @route '/artist/wallet/withdraw'
 */
withdraw.url = (options?: RouteQueryOptions) => {
    return withdraw.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\WalletController::withdraw
 * @see app/Http/Controllers/Artist/WalletController.php:165
 * @route '/artist/wallet/withdraw'
 */
withdraw.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: withdraw.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Artist\WalletController::withdraw
 * @see app/Http/Controllers/Artist/WalletController.php:165
 * @route '/artist/wallet/withdraw'
 */
    const withdrawForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: withdraw.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Artist\WalletController::withdraw
 * @see app/Http/Controllers/Artist/WalletController.php:165
 * @route '/artist/wallet/withdraw'
 */
        withdrawForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: withdraw.url(options),
            method: 'post',
        })
    
    withdraw.form = withdrawForm
/**
* @see \App\Http\Controllers\Artist\WalletController::withdrawalStatus
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
export const withdrawalStatus = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: withdrawalStatus.url(args, options),
    method: 'get',
})

withdrawalStatus.definition = {
    methods: ["get","head"],
    url: '/artist/wallet/withdrawals/{withdrawal}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\WalletController::withdrawalStatus
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
withdrawalStatus.url = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return withdrawalStatus.definition.url
            .replace('{withdrawal}', parsedArgs.withdrawal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\WalletController::withdrawalStatus
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
withdrawalStatus.get = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: withdrawalStatus.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\WalletController::withdrawalStatus
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
withdrawalStatus.head = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: withdrawalStatus.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\WalletController::withdrawalStatus
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
    const withdrawalStatusForm = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: withdrawalStatus.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\WalletController::withdrawalStatus
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
        withdrawalStatusForm.get = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: withdrawalStatus.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\WalletController::withdrawalStatus
 * @see app/Http/Controllers/Artist/WalletController.php:210
 * @route '/artist/wallet/withdrawals/{withdrawal}'
 */
        withdrawalStatusForm.head = (args: { withdrawal: string | { id: string } } | [withdrawal: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: withdrawalStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    withdrawalStatus.form = withdrawalStatusForm
const WalletController = { index, transactions, exportCsv, withdraw, withdrawalStatus }

export default WalletController