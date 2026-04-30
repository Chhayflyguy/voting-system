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
        Schema::table('events', function (Blueprint $table) {
            $table->decimal('total_cost', 10, 2)->nullable()->after('location');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->boolean('has_paid')->default(false)->after('is_present');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('total_cost');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn('has_paid');
        });
    }
};
