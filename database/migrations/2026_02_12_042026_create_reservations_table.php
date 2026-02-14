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
        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('reservation_number')->unique();
            $table->uuid('client_id');
            $table->uuid('artist_id');
            $table->uuid('service_id');
            $table->timestamp('scheduled_at');
            $table->unsignedInteger('duration_minutes');
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'])->default('pending');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('commission_rate', 5, 2);
            $table->decimal('commission_amount', 10, 2);
            $table->decimal('artist_earnings', 10, 2);
            $table->text('custom_message')->nullable();
            $table->string('recipient_name')->nullable();
            $table->string('relation_type')->nullable();
            $table->string('emotion_type')->nullable();
            $table->enum('location_type', ['home', 'online', 'public']);
            $table->string('location_address')->nullable();
            $table->string('location_link')->nullable();
            $table->string('qr_code')->nullable();
            $table->timestamp('checkin_at')->nullable();
            $table->timestamp('checkout_at')->nullable();
            $table->decimal('checkin_lat', 10, 8)->nullable();
            $table->decimal('checkin_lng', 11, 8)->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancel_reason')->nullable();
            $table->timestamps();

            $table->foreign('client_id')->references('id')->on('users');
            $table->foreign('artist_id')->references('id')->on('users');
            $table->foreign('service_id')->references('id')->on('services');
            $table->index('client_id');
            $table->index('artist_id');
            $table->index('service_id');
            $table->index('status');
            $table->index('scheduled_at');
            $table->index('reservation_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
