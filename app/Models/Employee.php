<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    // กำหนดฟิลด์
    protected $fillable = [
        'emp_no',
        'first_name',
        'last_name',
        'gender',
        'birth_date',
        'hire_date',
        'photo',
    ];
}
