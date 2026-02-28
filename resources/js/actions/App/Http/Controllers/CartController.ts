import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CartController::index
* @see app/Http/Controllers/CartController.php:20
* @route '/client/cart'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/client/cart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CartController::index
* @see app/Http/Controllers/CartController.php:20
* @route '/client/cart'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::index
* @see app/Http/Controllers/CartController.php:20
* @route '/client/cart'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CartController::index
* @see app/Http/Controllers/CartController.php:20
* @route '/client/cart'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:20
 * @route '/client/cart'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:20
 * @route '/client/cart'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:20
 * @route '/client/cart'
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
* @see \App\Http\Controllers\CartController::index
* @see app/Http/Controllers/CartController.php:20
* @route '/client/cart'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CartController::index
* @see app/Http/Controllers/CartController.php:20
* @route '/client/cart'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CartController::index
* @see app/Http/Controllers/CartController.php:20
* @route '/client/cart'
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
* @see \App\Http\Controllers\CartController::addItem
* @see app/Http/Controllers/CartController.php:75
* @route '/client/cart/items'
*/
export const addItem = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addItem.url(options),
    method: 'post',
})

addItem.definition = {
    methods: ["post"],
    url: '/client/cart/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CartController::addItem
* @see app/Http/Controllers/CartController.php:75
* @route '/client/cart/items'
*/
addItem.url = (options?: RouteQueryOptions) => {
    return addItem.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::addItem
* @see app/Http/Controllers/CartController.php:75
* @route '/client/cart/items'
*/
addItem.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addItem.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CartController::addItem
 * @see app/Http/Controllers/CartController.php:86
 * @route '/client/cart/items'
 */
    const addItemForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: addItem.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CartController::addItem
 * @see app/Http/Controllers/CartController.php:86
 * @route '/client/cart/items'
 */
        addItemForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: addItem.url(options),
            method: 'post',
        })
    
    addItem.form = addItemForm
/**
* @see \App\Http\Controllers\CartController::addItem
* @see app/Http/Controllers/CartController.php:75
* @route '/client/cart/items'
*/
const addItemForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addItem.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CartController::addItem
* @see app/Http/Controllers/CartController.php:75
* @route '/client/cart/items'
*/
addItemForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addItem.url(options),
    method: 'post',
})

addItem.form = addItemForm

/**
* @see \App\Http\Controllers\CartController::removeItem
* @see app/Http/Controllers/CartController.php:108
* @route '/client/cart/items/{item}'
*/
export const removeItem = (args: { item: string | { id: string } } | [item: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeItem.url(args, options),
    method: 'delete',
})

removeItem.definition = {
    methods: ["delete"],
    url: '/client/cart/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CartController::removeItem
* @see app/Http/Controllers/CartController.php:108
* @route '/client/cart/items/{item}'
*/
removeItem.url = (args: { item: string | { id: string } } | [item: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return removeItem.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::removeItem
* @see app/Http/Controllers/CartController.php:108
* @route '/client/cart/items/{item}'
*/
removeItem.delete = (args: { item: string | { id: string } } | [item: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeItem.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CartController::removeItem
 * @see app/Http/Controllers/CartController.php:130
 * @route '/client/cart/items/{item}'
 */
    const removeItemForm = (args: { item: string | { id: string } } | [item: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: removeItem.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CartController::removeItem
 * @see app/Http/Controllers/CartController.php:130
 * @route '/client/cart/items/{item}'
 */
        removeItemForm.delete = (args: { item: string | { id: string } } | [item: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: removeItem.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    removeItem.form = removeItemForm
/**
* @see \App\Http\Controllers\CartController::removeItem
* @see app/Http/Controllers/CartController.php:108
* @route '/client/cart/items/{item}'
*/
const removeItemForm = (args: { item: string | { id: string } } | [item: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CartController::removeItem
* @see app/Http/Controllers/CartController.php:108
* @route '/client/cart/items/{item}'
*/
removeItemForm.delete = (args: { item: string | { id: string } } | [item: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeItem.form = removeItemForm

/**
* @see \App\Http\Controllers\CartController::applyCoupon
* @see app/Http/Controllers/CartController.php:132
* @route '/client/cart/coupon'
*/
export const applyCoupon = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyCoupon.url(options),
    method: 'post',
})

applyCoupon.definition = {
    methods: ["post"],
    url: '/client/cart/coupon',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CartController::applyCoupon
* @see app/Http/Controllers/CartController.php:132
* @route '/client/cart/coupon'
*/
applyCoupon.url = (options?: RouteQueryOptions) => {
    return applyCoupon.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::applyCoupon
* @see app/Http/Controllers/CartController.php:132
* @route '/client/cart/coupon'
*/
applyCoupon.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyCoupon.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CartController::applyCoupon
 * @see app/Http/Controllers/CartController.php:154
 * @route '/client/cart/coupon'
 */
    const applyCouponForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: applyCoupon.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CartController::applyCoupon
 * @see app/Http/Controllers/CartController.php:154
 * @route '/client/cart/coupon'
 */
        applyCouponForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: applyCoupon.url(options),
            method: 'post',
        })
    
    applyCoupon.form = applyCouponForm
/**
* @see \App\Http\Controllers\CartController::applyCoupon
* @see app/Http/Controllers/CartController.php:132
* @route '/client/cart/coupon'
*/
const applyCouponForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: applyCoupon.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CartController::applyCoupon
* @see app/Http/Controllers/CartController.php:132
* @route '/client/cart/coupon'
*/
applyCouponForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: applyCoupon.url(options),
    method: 'post',
})

applyCoupon.form = applyCouponForm

/**
* @see \App\Http\Controllers\CartController::clear
* @see app/Http/Controllers/CartController.php:159
* @route '/client/cart'
*/
export const clear = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

clear.definition = {
    methods: ["delete"],
    url: '/client/cart',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CartController::clear
* @see app/Http/Controllers/CartController.php:159
* @route '/client/cart'
*/
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::clear
* @see app/Http/Controllers/CartController.php:159
* @route '/client/cart'
*/
clear.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CartController::clear
* @see app/Http/Controllers/CartController.php:159
* @route '/client/cart'
*/
const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clear.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CartController::clear
* @see app/Http/Controllers/CartController.php:159
* @route '/client/cart'
*/
clearForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clear.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

clear.form = clearForm

const CartController = { index, addItem, removeItem, applyCoupon, clear }

export default CartController