<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('perfil_administrador', function (Blueprint $table) {
        $table->unsignedBigInteger('id_usuario')->primary(); // PK = FK 1:1
        $table->string('telefono', 20)->nullable();
        $table->string('departamento', 100)->nullable();
        $table->timestamps();

        $table->foreign('id_usuario')
              ->references('id')->on('users')
              ->cascadeOnDelete()->cascadeOnUpdate();
    });
  }
  public function down(): void {
    Schema::dropIfExists('perfil_administrador');
  }
};

