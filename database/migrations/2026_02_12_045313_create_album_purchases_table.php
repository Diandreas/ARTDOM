<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('album_purchases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('client_id');
            $table->uuid('album_id');
            $table->uuid('payment_id');
            $table->decimal('price_paid', 10, 2);
            $table->timestamps();

            $table->foreign('client_id')->references('id')->on('users');
            $table->foreign('album_id')->references('id')->on('albums');
            $table->foreign('payment_id')->references('id')->on('payments');
            $table->index('client_id');
            $table->index('album_id');
            $table->unique(['client_id', 'album_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('album_purchases');
    }
};
