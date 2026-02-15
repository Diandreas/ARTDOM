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
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('method', ['orange_money', 'moov_money', 'mtn_money', 'wave', 'card', 'paypal', 'bank_transfer', 'mobile_money_orange', 'mobile_money_mtn', 'card_stripe'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('method', ['mobile_money_orange', 'mobile_money_mtn', 'card_stripe', 'paypal', 'bank_transfer'])->change();
        });
    }
};
