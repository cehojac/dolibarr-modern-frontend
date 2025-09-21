<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Dolibarr Front</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
  </head>
  <body class="h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
    <div id="app"></div>
  </body>
</html>
