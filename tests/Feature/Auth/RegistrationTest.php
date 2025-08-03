<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    // Registration is disabled, should redirect to login
    $response->assertRedirect(route('login'));
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    // Registration is disabled, should redirect to login
    $response->assertRedirect(route('login'));
})->skip('Registration is disabled for admin-only app');
