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
        Schema::create('artist_followers', function (Blueprint $table) {
            $table->uuid('client_id');
            $table->uuid('artist_id');
            $table->timestamps();

            $table->foreign('client_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('artist_id')->references('id')->on('users')->onDelete('cascade');
            $table->primary(['client_id', 'artist_id']);
            $table->index('artist_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artist_followers');
    }
};
