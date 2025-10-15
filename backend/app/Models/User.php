<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    // JWT için gereken metodlar 👇
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    public function hasRole($role): bool
    {
        $roles = is_array($this->roles) ? $this->roles : [$this->roles];
        return in_array($role, $roles);
    }

    public function hasAnyRole(array $roles): bool
    {
        $userRoles = is_array($this->roles) ? $this->roles : [$this->roles];
        return count(array_intersect($roles, $userRoles)) > 0;
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'author_id');
    }
}
