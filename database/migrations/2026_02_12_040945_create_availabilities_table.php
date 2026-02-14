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
        Schema::create('availabilities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('artist_id');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_booked')->default(false);
            $table->boolean('is_blocked')->default(false);
            $table->string('block_reason')->nullable();
            $table->string('repeat_rule')->nullable();
            $table->timestamps();

            $table->foreign('artist_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('artist_id');
            $table->index('date');
            $table->index(['artist_id', 'date', 'is_booked']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availabilities');
    }
};
