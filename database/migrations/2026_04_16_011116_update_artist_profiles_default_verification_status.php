<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing records
        DB::table('artist_profiles')->update([
            'is_verified' => true,
            'verification_status' => 'approved',
        ]);

        Schema::table('artist_profiles', function (Blueprint $table) {
            $table->boolean('is_verified')->default(true)->change();
            $table->enum('verification_status', ['pending', 'approved', 'rejected'])->default('approved')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artist_profiles', function (Blueprint $table) {
            $table->boolean('is_verified')->default(false)->change();
            $table->enum('verification_status', ['pending', 'approved', 'rejected'])->default('pending')->change();
        });
    }
};
