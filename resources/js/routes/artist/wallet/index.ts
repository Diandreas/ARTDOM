import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import withdrawal from './withdrawal'
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
* @see \App\Http\Controllers\Artist\WalletController::exportMethod
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/artist/wallet/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Artist\WalletController::exportMethod
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Artist\WalletController::exportMethod
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Artist\WalletController::exportMethod
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Artist\WalletController::exportMethod
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Artist\WalletController::exportMethod
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Artist\WalletController::exportMethod
 * @see app/Http/Controllers/Artist/WalletController.php:105
 * @route '/artist/wallet/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
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
const wallet = {
    index: Object.assign(index, index),
transactions: Object.assign(transactions, transactions),
export: Object.assign(exportMethod, exportMethod),
withdraw: Object.assign(withdraw, withdraw),
withdrawal: Object.assign(withdrawal, withdrawal),
}

export default wallet