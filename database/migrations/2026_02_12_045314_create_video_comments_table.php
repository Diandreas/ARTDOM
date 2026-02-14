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
        Schema::create('video_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('video_id');
            $table->uuid('user_id');
            $table->uuid('parent_id')->nullable();
            $table->text('content');
            $table->boolean('is_reported')->default(false);
            $table->timestamps();

            $table->foreign('video_id')->references('id')->on('videos')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('parent_id')->references('id')->on('video_comments');
            $table->index('video_id');
            $table->index('user_id');
            $table->index('parent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_comments');
    }
};
