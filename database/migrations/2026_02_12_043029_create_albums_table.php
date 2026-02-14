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
        Schema::create('albums', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('artist_id');
            $table->string('title');
            $table->year('year');
            $table->string('genre');
            $table->string('cover_url')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->boolean('is_streamable')->default(true);
            $table->boolean('is_purchasable')->default(true);
            $table->unsignedBigInteger('total_plays')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->foreign('artist_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('artist_id');
            $table->index('genre');
            $table->index('is_streamable');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};
