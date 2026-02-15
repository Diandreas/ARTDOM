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
        Schema::create('playlist_track', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('playlist_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('track_id')->constrained()->cascadeOnDelete();
            $table->integer('position')->default(0);
            $table->timestamps();

            // Prevent duplicate tracks in the same playlist
            $table->unique(['playlist_id', 'track_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('playlist_track');
    }
};
