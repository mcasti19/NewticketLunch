<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class menus extends Model
{
    /** @use HasFactory<\Database\Factories\MenusFactory> */
    use HasFactory;

    protected $fillable = [
        'sopa',
        'contour_one',
        'contour_two',
        'salad_one',
        'salad_two',
        'juice',
        'dessert'
    ];
}
