<?php

namespace ClarkWinkelmann\WhoRead;

use ClarkWinkelmann\WhoRead\Api\DiscussionResourceFields;
use ClarkWinkelmann\WhoRead\Api\ForumResourceFields;
use ClarkWinkelmann\WhoRead\Api\UserStateResource;
use Flarum\Api\Context;
use Flarum\Api\Endpoint\Endpoint;
use Flarum\Api\Resource;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Search\DiscussionSearcher;
use Flarum\Extend;
use Flarum\Search\Database\DatabaseSearchDriver;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Model(Discussion::class))
        ->relationship('clarkwinkelmannWhoReaders', DiscussionReaderRelationship::class),

    (new Extend\SearchDriver(DatabaseSearchDriver::class))
        ->addFilter(DiscussionSearcher::class, Query\ReadByEveryone::class),

    (new Extend\ApiResource(UserStateResource::class)),

    (new Extend\Settings())
        ->default('who-read.showInDiscussionList', true)
        ->default('who-read.showInHero', true)
        ->default('who-read.showBetweenPosts', true)
        ->default('who-read.showCountOfReadersWhoStopped', false)
        ->default('who-read.hideWhenBehind', 0)
        ->default('who-read.maxVisible', 10),

    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(ForumResourceFields::class),

    (new Extend\ApiResource(Resource\DiscussionResource::class))
        ->endpoint(['create', 'update', 'show', 'index'], function (Endpoint $endpoint) {
            return $endpoint
                ->eagerLoad(function ($i, Context $context) {
                    if (!$context->getActor()->hasPermission('who-read.seeRead')) {
                        return [];
                    }

                    return [
                        'clarkwinkelmannWhoReaders.user.groups',
                    ];
                })
                // It seems like we cannot easily set the include conditionally
                // So we'll just do the eager load conditionally, and have a hard-coded empty result in the relationship for the situation where it's not needed
                ->addDefaultInclude([
                    'clarkwinkelmannWhoReaders.user.groups',
                ]);
        })
        ->fields(DiscussionResourceFields::class),
];
