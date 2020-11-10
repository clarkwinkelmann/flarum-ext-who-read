<?php

namespace ClarkWinkelmann\WhoRead;

use Flarum\Discussion\Discussion;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Model(Discussion::class))
        ->relationship('clarkwinkelmannWhoReaders', new DiscussionReaderRelationship()),

    new Extenders\AddGambits(),
    new Extenders\DiscussionAttributes(),
    new Extenders\ForumAttributes(),
    new Extenders\SaveDiscussionUnread(),
];
