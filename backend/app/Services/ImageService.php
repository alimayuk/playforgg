<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    /**
     * Resim kaydetme işlemi.
     *
     * @param \Illuminate\Http\UploadedFile $imageFile
     * @param string $folder
     * @return string $filePath
     */
    static function uploadImage($imageFile, $folder)
    {
        $fileName = Str::slug(pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME))
            . '-' . time()
            . '.' . $imageFile->getClientOriginalExtension();

        return $imageFile->storeAs($folder, $fileName, 'public');
    }

    /**
     * Resmi silme işlemi.
     *
     * @param string $oldImagePath
     * @return void
     */
    static function deleteImage($oldImagePath)
    {
        if ($oldImagePath && Storage::disk('public')->exists(str_replace('storage/', '', $oldImagePath))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $oldImagePath));
        }
    }
}