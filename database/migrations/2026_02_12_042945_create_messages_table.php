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
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('conversation_id');
            $table->uuid('sender_id');
            $table->text('content')->nullable();
            $table->enum('type', ['text', 'image', 'audio', 'video', 'file'])->default('text');
            $table->string('media_url')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->uuid('reply_to_id')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->boolean('is_read')->default(false);
            $table->json('reactions')->nullable();
            $table->timestamp('sent_at');
            $table->timestamps();

            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
            $table->foreign('sender_id')->references('id')->on('users');
            $table->foreign('reply_to_id')->references('id')->on('messages');
            $table->index('conversation_id');
            $table->index('sender_id');
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
