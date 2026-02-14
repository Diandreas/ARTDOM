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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reservation_id')->nullable();
            $table->uuid('client_id');
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('XAF');
            $table->enum('method', ['mobile_money_orange', 'mobile_money_mtn', 'card_stripe', 'paypal', 'bank_transfer']);
            $table->string('provider_ref')->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded'])->default('pending');
            $table->json('metadata')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();

            $table->foreign('reservation_id')->references('id')->on('reservations');
            $table->foreign('client_id')->references('id')->on('users');
            $table->index('reservation_id');
            $table->index('client_id');
            $table->index('status');
            $table->index('provider_ref');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
