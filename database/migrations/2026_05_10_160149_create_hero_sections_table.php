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
        Schema::create('hero_sections', function (Blueprint $table) {
            $table->id();
            // Type de media : 'image' | 'video_upload' | 'video_youtube' | 'artist'
            $table->string('media_type')->default('image');
            $table->string('title')->nullable();
            $table->string('title_en')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('subtitle_en')->nullable();
            // Image de fond
            $table->string('image_url')->nullable();
            $table->string('image_url_en')->nullable();
            // Vidéo uploadée (stockage local)
            $table->string('video_url')->nullable();
            // URL YouTube (embed)
            $table->string('youtube_url')->nullable();
            // CTA
            $table->string('link_url')->nullable();
            $table->string('link_label')->nullable();
            $table->string('link_label_en')->nullable();
            // Artiste mis en avant dans cette section
            $table->foreignId('artist_id')->nullable()->constrained('users')->nullOnDelete();
            // Ordre d'affichage dans le carousel hero
            $table->unsignedSmallInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_sections');
    }
};
