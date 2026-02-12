<?php

namespace App\Enums;

enum UserRole: string
{
    case Client = 'client';
    case Artist = 'artist';
    case Admin = 'admin';
}
