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
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('wallet_id');
            $table->enum('type', ['credit_prestation', 'credit_album_sale', 'credit_streaming', 'debit_withdrawal', 'debit_refund', 'commission']);
            $table->decimal('amount', 10, 2);
            $table->decimal('commission', 10, 2)->default(0);
            $table->decimal('net_amount', 10, 2);
            $table->string('source')->nullable();
            $table->uuid('reference_id')->nullable();
            $table->string('reference_type')->nullable();
            $table->decimal('balance_after', 12, 2);
            $table->string('note')->nullable();
            $table->timestamps();

            $table->foreign('wallet_id')->references('id')->on('wallets')->onDelete('cascade');
            $table->index('wallet_id');
            $table->index('type');
            $table->index('reference_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
