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
        Schema::create('videos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('artist_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('video_url');
            $table->string('thumbnail_url')->nullable();
            $table->unsignedInteger('duration_seconds');
            $table->string('category');
            $table->json('tags')->nullable();
            $table->unsignedBigInteger('views')->default(0);
            $table->unsignedInteger('likes')->default(0);
            $table->enum('visibility', ['public', 'subscribers', 'private'])->default('public');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->foreign('artist_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('artist_id');
            $table->index('visibility');
            $table->index('published_at');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
