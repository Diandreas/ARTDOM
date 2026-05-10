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
        Schema::table('hero_settings', function (Blueprint $table) {
            // Vidéo uploadée (stockage local), distinct de video_url (URL externe)
            $table->string('video_upload_url')->nullable()->after('video_url');
            // URL YouTube pour embed dans le hero
            $table->string('youtube_url')->nullable()->after('video_upload_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->dropColumn(['video_upload_url', 'youtube_url']);
        });
    }
};
