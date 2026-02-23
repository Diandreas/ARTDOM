import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:33
 * @route '/admin/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:33
 * @route '/admin/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:33
 * @route '/admin/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:33
 * @route '/admin/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:33
 * @route '/admin/users'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:33
 * @route '/admin/users'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserManagementController::index
 * @see app/Http/Controllers/Admin/UserManagementController.php:33
 * @route '/admin/users'
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
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:136
 * @route '/admin/users/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/users/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:136
 * @route '/admin/users/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:136
 * @route '/admin/users/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:136
 * @route '/admin/users/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:136
 * @route '/admin/users/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:136
 * @route '/admin/users/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserManagementController::create
 * @see app/Http/Controllers/Admin/UserManagementController.php:136
 * @route '/admin/users/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:143
 * @route '/admin/users'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:143
 * @route '/admin/users'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:143
 * @route '/admin/users'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:143
 * @route '/admin/users'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::store
 * @see app/Http/Controllers/Admin/UserManagementController.php:143
 * @route '/admin/users'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:205
 * @route '/admin/users/{user}'
 */
export const show = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/users/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:205
 * @route '/admin/users/{user}'
 */
show.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:205
 * @route '/admin/users/{user}'
 */
show.get = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:205
 * @route '/admin/users/{user}'
 */
show.head = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:205
 * @route '/admin/users/{user}'
 */
    const showForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:205
 * @route '/admin/users/{user}'
 */
        showForm.get = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserManagementController::show
 * @see app/Http/Controllers/Admin/UserManagementController.php:205
 * @route '/admin/users/{user}'
 */
        showForm.head = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:271
 * @route '/admin/users/{user}/edit'
 */
export const edit = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/users/{user}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:271
 * @route '/admin/users/{user}/edit'
 */
edit.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return edit.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:271
 * @route '/admin/users/{user}/edit'
 */
edit.get = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:271
 * @route '/admin/users/{user}/edit'
 */
edit.head = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:271
 * @route '/admin/users/{user}/edit'
 */
    const editForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:271
 * @route '/admin/users/{user}/edit'
 */
        editForm.get = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserManagementController::edit
 * @see app/Http/Controllers/Admin/UserManagementController.php:271
 * @route '/admin/users/{user}/edit'
 */
        editForm.head = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:299
 * @route '/admin/users/{user}'
 */
export const update = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/users/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:299
 * @route '/admin/users/{user}'
 */
update.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:299
 * @route '/admin/users/{user}'
 */
update.put = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:299
 * @route '/admin/users/{user}'
 */
    const updateForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::update
 * @see app/Http/Controllers/Admin/UserManagementController.php:299
 * @route '/admin/users/{user}'
 */
        updateForm.put = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:385
 * @route '/admin/users/{user}'
 */
export const destroy = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:385
 * @route '/admin/users/{user}'
 */
destroy.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:385
 * @route '/admin/users/{user}'
 */
destroy.delete = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:385
 * @route '/admin/users/{user}'
 */
    const destroyForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
 * @see app/Http/Controllers/Admin/UserManagementController.php:385
 * @route '/admin/users/{user}'
 */
        destroyForm.delete = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\UserManagementController::suspend
 * @see app/Http/Controllers/Admin/UserManagementController.php:357
 * @route '/admin/users/{user}/suspend'
 */
export const suspend = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suspend.url(args, options),
    method: 'post',
})

suspend.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/suspend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::suspend
 * @see app/Http/Controllers/Admin/UserManagementController.php:357
 * @route '/admin/users/{user}/suspend'
 */
suspend.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return suspend.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::suspend
 * @see app/Http/Controllers/Admin/UserManagementController.php:357
 * @route '/admin/users/{user}/suspend'
 */
suspend.post = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suspend.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::suspend
 * @see app/Http/Controllers/Admin/UserManagementController.php:357
 * @route '/admin/users/{user}/suspend'
 */
    const suspendForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: suspend.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::suspend
 * @see app/Http/Controllers/Admin/UserManagementController.php:357
 * @route '/admin/users/{user}/suspend'
 */
        suspendForm.post = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: suspend.url(args, options),
            method: 'post',
        })
    
    suspend.form = suspendForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::activate
 * @see app/Http/Controllers/Admin/UserManagementController.php:364
 * @route '/admin/users/{user}/activate'
 */
export const activate = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

activate.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::activate
 * @see app/Http/Controllers/Admin/UserManagementController.php:364
 * @route '/admin/users/{user}/activate'
 */
activate.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return activate.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::activate
 * @see app/Http/Controllers/Admin/UserManagementController.php:364
 * @route '/admin/users/{user}/activate'
 */
activate.post = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::activate
 * @see app/Http/Controllers/Admin/UserManagementController.php:364
 * @route '/admin/users/{user}/activate'
 */
    const activateForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::activate
 * @see app/Http/Controllers/Admin/UserManagementController.php:364
 * @route '/admin/users/{user}/activate'
 */
        activateForm.post = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activate.url(args, options),
            method: 'post',
        })
    
    activate.form = activateForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::ban
 * @see app/Http/Controllers/Admin/UserManagementController.php:371
 * @route '/admin/users/{user}/ban'
 */
export const ban = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ban.url(args, options),
    method: 'post',
})

ban.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/ban',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::ban
 * @see app/Http/Controllers/Admin/UserManagementController.php:371
 * @route '/admin/users/{user}/ban'
 */
ban.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return ban.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::ban
 * @see app/Http/Controllers/Admin/UserManagementController.php:371
 * @route '/admin/users/{user}/ban'
 */
ban.post = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ban.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::ban
 * @see app/Http/Controllers/Admin/UserManagementController.php:371
 * @route '/admin/users/{user}/ban'
 */
    const banForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ban.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::ban
 * @see app/Http/Controllers/Admin/UserManagementController.php:371
 * @route '/admin/users/{user}/ban'
 */
        banForm.post = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ban.url(args, options),
            method: 'post',
        })
    
    ban.form = banForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::impersonate
 * @see app/Http/Controllers/Admin/UserManagementController.php:452
 * @route '/admin/users/{user}/impersonate'
 */
export const impersonate = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: impersonate.url(args, options),
    method: 'post',
})

impersonate.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/impersonate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::impersonate
 * @see app/Http/Controllers/Admin/UserManagementController.php:452
 * @route '/admin/users/{user}/impersonate'
 */
impersonate.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return impersonate.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::impersonate
 * @see app/Http/Controllers/Admin/UserManagementController.php:452
 * @route '/admin/users/{user}/impersonate'
 */
impersonate.post = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: impersonate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::impersonate
 * @see app/Http/Controllers/Admin/UserManagementController.php:452
 * @route '/admin/users/{user}/impersonate'
 */
    const impersonateForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: impersonate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::impersonate
 * @see app/Http/Controllers/Admin/UserManagementController.php:452
 * @route '/admin/users/{user}/impersonate'
 */
        impersonateForm.post = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: impersonate.url(args, options),
            method: 'post',
        })
    
    impersonate.form = impersonateForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::stopImpersonation
 * @see app/Http/Controllers/Admin/UserManagementController.php:466
 * @route '/admin/users/stop-impersonation'
 */
export const stopImpersonation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopImpersonation.url(options),
    method: 'post',
})

stopImpersonation.definition = {
    methods: ["post"],
    url: '/admin/users/stop-impersonation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::stopImpersonation
 * @see app/Http/Controllers/Admin/UserManagementController.php:466
 * @route '/admin/users/stop-impersonation'
 */
stopImpersonation.url = (options?: RouteQueryOptions) => {
    return stopImpersonation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::stopImpersonation
 * @see app/Http/Controllers/Admin/UserManagementController.php:466
 * @route '/admin/users/stop-impersonation'
 */
stopImpersonation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopImpersonation.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::stopImpersonation
 * @see app/Http/Controllers/Admin/UserManagementController.php:466
 * @route '/admin/users/stop-impersonation'
 */
    const stopImpersonationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: stopImpersonation.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::stopImpersonation
 * @see app/Http/Controllers/Admin/UserManagementController.php:466
 * @route '/admin/users/stop-impersonation'
 */
        stopImpersonationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: stopImpersonation.url(options),
            method: 'post',
        })
    
    stopImpersonation.form = stopImpersonationForm
/**
* @see \App\Http\Controllers\Admin\UserManagementController::bulk
 * @see app/Http/Controllers/Admin/UserManagementController.php:392
 * @route '/admin/users/bulk'
 */
export const bulk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

bulk.definition = {
    methods: ["post"],
    url: '/admin/users/bulk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::bulk
 * @see app/Http/Controllers/Admin/UserManagementController.php:392
 * @route '/admin/users/bulk'
 */
bulk.url = (options?: RouteQueryOptions) => {
    return bulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::bulk
 * @see app/Http/Controllers/Admin/UserManagementController.php:392
 * @route '/admin/users/bulk'
 */
bulk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserManagementController::bulk
 * @see app/Http/Controllers/Admin/UserManagementController.php:392
 * @route '/admin/users/bulk'
 */
    const bulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulk.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserManagementController::bulk
 * @see app/Http/Controllers/Admin/UserManagementController.php:392
 * @route '/admin/users/bulk'
 */
        bulkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulk.url(options),
            method: 'post',
        })
    
    bulk.form = bulkForm
const UserManagementController = { index, create, store, show, edit, update, destroy, suspend, activate, ban, impersonate, stopImpersonation, bulk }

export default UserManagementController