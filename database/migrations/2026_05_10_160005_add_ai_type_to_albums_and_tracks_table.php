<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('albums', function (Blueprint $table) {
            // 'human' | 'partial_ai' | 'full_ai'
            $table->string('ai_type')->default('human')->after('total_plays');
        });

        Schema::table('tracks', function (Blueprint $table) {
            $table->string('ai_type')->default('human')->after('is_banned');
        });
    }

    public function down(): void
    {
        Schema::table('albums', function (Blueprint $table) {
            $table->dropColumn('ai_type');
        });

        Schema::table('tracks', function (Blueprint $table) {
            $table->dropColumn('ai_type');
        });
    }
};
