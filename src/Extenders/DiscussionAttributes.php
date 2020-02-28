<?php

namespace ClarkWinkelmann\WhoRead\Extenders;

use ClarkWinkelmann\WhoRead\Serializers\UserStateSerializer;
use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Controller\ShowDiscussionController;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\UserState;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\Builder;

class DiscussionAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(WillGetData::class, [$this, 'includes']);
        $container['events']->listen(GetApiRelationship::class, [$this, 'serializer']);
        $container['events']->listen(Serializing::class, [$this, 'attributes']);
        $container['events']->listen(GetModelRelationship::class, [$this, 'relationship']);
    }

    public function includes(WillGetData $event)
    {
        if ($event->isController(ListDiscussionsController::class) ||
            $event->isController(ShowDiscussionController::class)) {
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
        if ($event->isSerializer(DiscussionSerializer::class) && !$event->actor->hasPermission('who-read.seeRead')) {
            $event->model->setRelation('clarkwinkelmannWhoReaders', null);
        }
    }

    public function relationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Discussion::class, 'clarkwinkelmannWhoReaders')) {
            $relationship = $event->model->hasMany(UserState::class)
                ->whereNotNull('last_read_post_number')
                ->orderBy('last_read_post_number', 'desc')
                ->orderBy('last_read_at', 'desc');

            /**
             * @var $settings SettingsRepositoryInterface
             */
            $settings = app(SettingsRepositoryInterface::class);

            if ($groups = $settings->get('who-read.onlyGroups')) {
                $relationship->whereHas('user.groups', function (Builder $query) use ($groups) {
                    $query->whereIn('id', explode(',', $groups));
                });
            }

            return $relationship;
        }
    }
}
