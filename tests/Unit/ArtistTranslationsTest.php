<?php

it('has artist page translation keys in english and french', function () {
    $root = dirname(__DIR__, 2);

    $files = [
        $root.'/resources/js/pages/Artist/Agenda.tsx',
        $root.'/resources/js/pages/Artist/OrderDetail.tsx',
        $root.'/resources/js/pages/Artist/Orders.tsx',
        $root.'/resources/js/pages/Artist/Services.tsx',
        $root.'/resources/js/pages/Artist/Subscription.tsx',
        $root.'/resources/js/pages/Artist/Wallet.tsx',
        $root.'/resources/js/pages/Artist/profile.tsx',
        $root.'/resources/js/pages/Artist/upload-albums.tsx',
    ];

    $english = json_decode(file_get_contents($root.'/lang/en.json'), true, flags: JSON_THROW_ON_ERROR);
    $french = json_decode(file_get_contents($root.'/lang/fr.json'), true, flags: JSON_THROW_ON_ERROR);

    $keys = collect($files)
        ->flatMap(function (string $file): array {
            preg_match_all("/\\bt\\('([^']+)'\\)/", file_get_contents($file), $matches);

            return $matches[1] ?? [];
        })
        ->unique()
        ->values();

    $missingInEnglish = $keys->reject(fn (string $key): bool => array_key_exists($key, $english))->values();
    $missingInFrench = $keys->reject(fn (string $key): bool => array_key_exists($key, $french))->values();

    expect($missingInEnglish)->toBeEmpty();
    expect($missingInFrench)->toBeEmpty();
});
