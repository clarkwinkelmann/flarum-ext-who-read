<?php

use Flarum\Database\Migration;

return Migration::addColumns('discussion_user', [
    'who_read_unread' => ['boolean', 'default' => false],
]);
