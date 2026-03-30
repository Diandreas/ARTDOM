<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('album_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('album_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'album_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('album_favorites');
    }
};
