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
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reservation_id')->unique();
            $table->uuid('client_id');
            $table->uuid('artist_id');
            $table->uuid('service_id');
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->boolean('is_reported')->default(false);
            $table->string('report_reason')->nullable();
            $table->timestamps();

            $table->foreign('reservation_id')->references('id')->on('reservations');
            $table->foreign('client_id')->references('id')->on('users');
            $table->foreign('artist_id')->references('id')->on('users');
            $table->foreign('service_id')->references('id')->on('services');
            $table->index('client_id');
            $table->index('artist_id');
            $table->index('service_id');
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
