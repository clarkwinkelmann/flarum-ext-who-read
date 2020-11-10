<?php

namespace ClarkWinkelmann\WhoRead\Extenders;

use ClarkWinkelmann\WhoRead\Serializers\UserStateSerializer;
use Flarum\Api\Controller\CreateDiscussionController;
use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Controller\ShowDiscussionController;
use Flarum\Api\Controller\UpdateDiscussionController;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Event\GetApiRelationship;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class DiscussionAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(WillGetData::class, [$this, 'includes']);
        $container['events']->listen(GetApiRelationship::class, [$this, 'serializer']);
        $container['events']->listen(Serializing::class, [$this, 'attributes']);
    }

    public function includes(WillGetData $event)
    {
        if ($event->isController(ListDiscussionsController::class) ||
            $event->isController(ShowDiscussionController::class) ||
            $event->isController(CreateDiscussionController::class) ||
            $event->isController(UpdateDiscussionController::class)) {
            $event->addInclude('clarkwinkelmannWhoReaders.user.groups');
        }
    }

    public function serializer(GetApiRelationship $event)
    {
        if ($event->isRelationship(DiscussionSerializer::class, 'clarkwinkelmannWhoReaders')) {
            return $event->serializer->hasMany($event->model, UserStateSerializer::class, 'clarkwinkelmannWhoReaders');
        }
    }

    public function attributes(Serializing $event)
    {
        if ($event->isSerializer(DiscussionSerializer::class)) {
            if ($event->actor->hasPermission('who-read.markUnread')) {
                $event->attributes['whoReadCanMarkUnread'] = true;

                if ($state = $event->model->state) {
                    $event->attributes['whoReadUnread'] = (bool)$state->who_read_unread;
                }
            }

            if (!$event->actor->hasPermission('who-read.seeRead')) {
                $event->model->setRelation('clarkwinkelmannWhoReaders', null);
            }
        }
    }
}
