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
        Schema::create('services', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('artist_id');
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->decimal('price', 10, 2);
            $table->enum('price_type', ['fixed', 'from', 'hourly'])->default('fixed');
            $table->unsignedInteger('duration_minutes');
            $table->unsignedInteger('notice_period_hours')->default(48);
            $table->enum('location_type', ['home', 'online', 'public', 'any']);
            $table->json('options')->nullable();
            $table->json('media_urls')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            $table->foreign('artist_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('artist_id');
            $table->index('category');
            $table->index('is_active');
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
