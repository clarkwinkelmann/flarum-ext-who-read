<?php

namespace ClarkWinkelmann\WhoRead;

use Flarum\Api\Controller;
use Flarum\Api\Serializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving;
use Flarum\Event\ConfigureDiscussionGambits;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Model(Discussion::class))
        ->relationship('clarkwinkelmannWhoReaders', DiscussionReaderRelationship::class),

    (new Extend\Event())
        ->listen(ConfigureDiscussionGambits::class, function (ConfigureDiscussionGambits $event) {
            $event->gambits->add(Gambits\NotFullyRead::class);
        })
        ->listen(Saving::class, Listeners\SaveDiscussionUnread::class),

    (new Extend\ApiSerializer(Serializer\ForumSerializer::class))
        ->mutate(ForumAttributes::class),

    (new Extend\ApiSerializer(Serializer\DiscussionSerializer::class))
        ->hasMany('clarkwinkelmannWhoReaders', Serializers\UserStateSerializer::class)
        ->mutate(DiscussionAttributes::class),

    (new Extend\ApiController(Controller\ListDiscussionsController::class))
        ->addInclude('clarkwinkelmannWhoReaders.user.groups'),
    (new Extend\ApiController(Controller\ShowDiscussionController::class))
        ->addInclude('clarkwinkelmannWhoReaders.user.groups'),
    (new Extend\ApiController(Controller\CreateDiscussionController::class))
        ->addInclude('clarkwinkelmannWhoReaders.user.groups'),
    (new Extend\ApiController(Controller\UpdateDiscussionController::class))
        ->addInclude('clarkwinkelmannWhoReaders.user.groups'),
];
