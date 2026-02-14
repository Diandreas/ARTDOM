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
        Schema::create('tracks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('album_id');
            $table->string('title');
            $table->unsignedInteger('duration_seconds');
            $table->string('file_url');
            $table->text('lyrics')->nullable();
            $table->unsignedBigInteger('plays')->default(0);
            $table->unsignedTinyInteger('track_number');
            $table->timestamps();

            $table->foreign('album_id')->references('id')->on('albums')->onDelete('cascade');
            $table->index('album_id');
            $table->index('track_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracks');
    }
};
