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
        Schema::table('artist_profiles', function (Blueprint $blueprint) {
            $blueprint->boolean('is_featured')->default(false)->after('is_verified');
            $blueprint->integer('featured_order')->default(0)->after('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artist_profiles', function (Blueprint $blueprint) {
            $blueprint->dropColumn(['is_featured', 'featured_order']);
        });
    }
};
