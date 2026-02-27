<?php

use App\Models\User;

it('super admin can access admin dashboard and super crud module', function () {
    $superAdmin = User::factory()->superAdmin()->create();

    $this->actingAs($superAdmin)
        ->get(route('admin.dashboard'))
        ->assertOk();

    $this->actingAs($superAdmin)
        ->get(route('admin.super-crud.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/SuperCrud/Index')
            ->has('resources')
        );
});

it('normal admin cannot access super crud module', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.super-crud.index'))
        ->assertForbidden();
});
