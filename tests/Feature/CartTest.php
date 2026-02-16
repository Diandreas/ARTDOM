<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Service;
use App\Models\User;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->artist = User::factory()->artist()->create();
    $this->artist->artistProfile()->create([
        'stage_name' => 'Test Artist',
        'bio' => 'Test bio',
        'categories' => ['singer'],
    ]);

    $this->service = Service::factory()->create([
        'artist_id' => $this->artist->id,
        'price' => 10000,
        'is_active' => true,
    ]);

    $this->client = User::factory()->create(['role' => 'client']);
});

test('authenticated client can view cart', function () {
    actingAs($this->client);

    $response = $this->get(route('client.cart.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Client/Cart/Index')
        ->has('cart')
    );
});

test('cart page requires authentication', function () {
    $response = $this->get(route('client.cart.index'));

    $response->assertRedirect(route('login'));
});

test('cart page requires client role', function () {
    actingAs($this->artist);

    $response = $this->get(route('client.cart.index'));

    $response->assertRedirect(route('artist.dashboard'));
});

test('client can add item to cart', function () {
    actingAs($this->client);

    $scheduledAt = now()->addDays(3)->format('Y-m-d H:i:s');

    $response = $this->post(route('client.cart.addItem'), [
        'service_id' => $this->service->id,
        'quantity' => 1,
        'customization' => [
            'recipient_name' => 'John Doe',
            'emotion_type' => 'Joie',
            'message' => 'Happy birthday!',
        ],
        'scheduled_at' => $scheduledAt,
    ]);

    $response->assertSessionHas('toast');

    $this->assertDatabaseHas('cart_items', [
        'service_id' => $this->service->id,
        'quantity' => 1,
        'unit_price' => 10000,
    ]);
});

test('adding item validates required fields', function () {
    actingAs($this->client);

    $response = $this->post(route('client.cart.addItem'), [
        'quantity' => 1,
    ]);

    $response->assertSessionHasErrors(['service_id', 'scheduled_at']);
});

test('adding item validates service exists', function () {
    actingAs($this->client);

    $response = $this->post(route('client.cart.addItem'), [
        'service_id' => 'non-existent-id',
        'quantity' => 1,
        'scheduled_at' => now()->addDays(3),
    ]);

    $response->assertSessionHasErrors(['service_id']);
});

test('client can remove item from cart', function () {
    actingAs($this->client);

    $cart = Cart::create([
        'client_id' => $this->client->id,
        'total_amount' => 10000,
    ]);

    $item = CartItem::create([
        'cart_id' => $cart->id,
        'service_id' => $this->service->id,
        'quantity' => 1,
        'unit_price' => 10000,
        'scheduled_at' => now()->addDays(3),
    ]);

    $response = $this->delete(route('client.cart.removeItem', $item));

    $response->assertSessionHas('toast');
    $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
});

test('client cannot remove item from another clients cart', function () {
    $otherClient = User::factory()->create(['role' => 'client']);
    actingAs($this->client);

    $otherCart = Cart::create([
        'client_id' => $otherClient->id,
        'total_amount' => 10000,
    ]);

    $item = CartItem::create([
        'cart_id' => $otherCart->id,
        'service_id' => $this->service->id,
        'quantity' => 1,
        'unit_price' => 10000,
        'scheduled_at' => now()->addDays(3),
    ]);

    $response = $this->delete(route('client.cart.removeItem', $item));

    $response->assertStatus(403);
    $this->assertDatabaseHas('cart_items', ['id' => $item->id]);
});

test('client can apply valid coupon to cart', function () {
    actingAs($this->client);

    $cart = Cart::create([
        'client_id' => $this->client->id,
        'total_amount' => 20000,
    ]);

    CartItem::create([
        'cart_id' => $cart->id,
        'service_id' => $this->service->id,
        'quantity' => 2,
        'unit_price' => 10000,
        'scheduled_at' => now()->addDays(3),
    ]);

    $coupon = Coupon::factory()->create([
        'code' => 'TEST10',
        'discount_type' => 'percentage',
        'discount_value' => 10,
        'min_order_amount' => 0,
        'is_active' => true,
    ]);

    $response = $this->post(route('client.cart.applyCoupon'), [
        'code' => 'TEST10',
    ]);

    $response->assertSessionHas('toast');

    $cart->refresh();
    expect($cart->coupon_code)->toBe('TEST10');
    expect($cart->discount)->toBeGreaterThan(0);
});

test('applying invalid coupon shows error', function () {
    actingAs($this->client);

    Cart::create([
        'client_id' => $this->client->id,
        'total_amount' => 20000,
    ]);

    $response = $this->post(route('client.cart.applyCoupon'), [
        'code' => 'INVALID',
    ]);

    $response->assertSessionHasErrors(['code']);
});

test('applying expired coupon shows error', function () {
    actingAs($this->client);

    $cart = Cart::create([
        'client_id' => $this->client->id,
        'total_amount' => 20000,
    ]);

    CartItem::create([
        'cart_id' => $cart->id,
        'service_id' => $this->service->id,
        'quantity' => 2,
        'unit_price' => 10000,
        'scheduled_at' => now()->addDays(3),
    ]);

    $coupon = Coupon::factory()->expired()->create([
        'code' => 'EXPIRED',
    ]);

    $response = $this->post(route('client.cart.applyCoupon'), [
        'code' => 'EXPIRED',
    ]);

    $response->assertSessionHasErrors(['code']);
});

test('client can clear cart', function () {
    actingAs($this->client);

    $cart = Cart::create([
        'client_id' => $this->client->id,
        'total_amount' => 20000,
        'coupon_code' => 'TEST10',
        'discount' => 2000,
    ]);

    CartItem::create([
        'cart_id' => $cart->id,
        'service_id' => $this->service->id,
        'quantity' => 2,
        'unit_price' => 10000,
        'scheduled_at' => now()->addDays(3),
    ]);

    $response = $this->delete(route('client.cart.clear'));

    $response->assertSessionHas('toast');

    $cart->refresh();
    expect($cart->items()->count())->toBe(0);
    expect($cart->coupon_code)->toBeNull();
    expect((float) $cart->discount)->toBe(0.0);
    expect((float) $cart->total_amount)->toBe(0.0);
});
