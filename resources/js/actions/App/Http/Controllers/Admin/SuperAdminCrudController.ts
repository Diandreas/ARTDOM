import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::index
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:48
* @route '/admin/super-crud'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/super-crud',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::index
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:48
* @route '/admin/super-crud'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::index
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:48
* @route '/admin/super-crud'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::index
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:48
* @route '/admin/super-crud'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::index
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:48
* @route '/admin/super-crud'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::index
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:48
* @route '/admin/super-crud'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::index
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:48
* @route '/admin/super-crud'
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
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::show
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:65
* @route '/admin/super-crud/{resource}'
*/
export const show = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/super-crud/{resource}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::show
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:65
* @route '/admin/super-crud/{resource}'
*/
show.url = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resource: args }
    }

    if (Array.isArray(args)) {
        args = {
            resource: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resource: args.resource,
    }

    return show.definition.url
            .replace('{resource}', parsedArgs.resource.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::show
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:65
* @route '/admin/super-crud/{resource}'
*/
show.get = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::show
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:65
* @route '/admin/super-crud/{resource}'
*/
show.head = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::show
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:65
* @route '/admin/super-crud/{resource}'
*/
const showForm = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::show
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:65
* @route '/admin/super-crud/{resource}'
*/
showForm.get = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::show
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:65
* @route '/admin/super-crud/{resource}'
*/
showForm.head = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::store
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:97
* @route '/admin/super-crud/{resource}'
*/
export const store = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/super-crud/{resource}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::store
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:97
* @route '/admin/super-crud/{resource}'
*/
store.url = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resource: args }
    }

    if (Array.isArray(args)) {
        args = {
            resource: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resource: args.resource,
    }

    return store.definition.url
            .replace('{resource}', parsedArgs.resource.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::store
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:97
* @route '/admin/super-crud/{resource}'
*/
store.post = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::store
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:97
* @route '/admin/super-crud/{resource}'
*/
const storeForm = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::store
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:97
* @route '/admin/super-crud/{resource}'
*/
storeForm.post = (args: { resource: string | number } | [resource: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::update
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:107
* @route '/admin/super-crud/{resource}/{id}'
*/
export const update = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/super-crud/{resource}/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::update
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:107
* @route '/admin/super-crud/{resource}/{id}'
*/
update.url = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            resource: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resource: args.resource,
        id: args.id,
    }

    return update.definition.url
            .replace('{resource}', parsedArgs.resource.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::update
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:107
* @route '/admin/super-crud/{resource}/{id}'
*/
update.put = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::update
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:107
* @route '/admin/super-crud/{resource}/{id}'
*/
const updateForm = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::update
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:107
* @route '/admin/super-crud/{resource}/{id}'
*/
updateForm.put = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::destroy
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:120
* @route '/admin/super-crud/{resource}/{id}'
*/
export const destroy = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/super-crud/{resource}/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::destroy
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:120
* @route '/admin/super-crud/{resource}/{id}'
*/
destroy.url = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            resource: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resource: args.resource,
        id: args.id,
    }

    return destroy.definition.url
            .replace('{resource}', parsedArgs.resource.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::destroy
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:120
* @route '/admin/super-crud/{resource}/{id}'
*/
destroy.delete = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::destroy
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:120
* @route '/admin/super-crud/{resource}/{id}'
*/
const destroyForm = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SuperAdminCrudController::destroy
* @see app/Http/Controllers/Admin/SuperAdminCrudController.php:120
* @route '/admin/super-crud/{resource}/{id}'
*/
destroyForm.delete = (args: { resource: string | number, id: string | number } | [resource: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const SuperAdminCrudController = { index, show, store, update, destroy }

export default SuperAdminCrudController