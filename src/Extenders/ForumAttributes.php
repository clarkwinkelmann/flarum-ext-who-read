<?php

namespace ClarkWinkelmann\WhoRead\Extenders;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extension\Extension;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Container\Container;

class ForumAttributes
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Serializing::class, [$this, 'attributes']);
    }

    public function attributes(Serializing $event)
    {
        if ($event->serializer instanceof ForumSerializer && $event->actor->hasPermission('who-read.seeRead')) {
            /**
             * @var $settings SettingsRepositoryInterface
             */
            $settings = app(SettingsRepositoryInterface::class);

            $event->attributes['who-read.canSee'] = true;
            $event->attributes['who-read.showInDiscussionList'] = (bool)$settings->get('who-read.showInDiscussionList', true);
            $event->attributes['who-read.showInHero'] = (bool)$settings->get('who-read.showInHero', true);
            $event->attributes['who-read.showBetweenPosts'] = (bool)$settings->get('who-read.showBetweenPosts', true);
            $event->attributes['who-read.showCountOfReadersWhoStopped'] = (bool)$settings->get('who-read.showCountOfReadersWhoStopped', false);
            $event->attributes['who-read.hideWhenBehind'] = (int)$settings->get('who-read.hideWhenBehind', 0);
            $event->attributes['who-read.maxVisible'] = (int)$settings->get('who-read.maxVisible', 10);
            $event->attributes['who-read.unreadIcon'] = $settings->get('who-read.unreadIcon') ?: 'fas fa-eye-slash';
        }
    }
}
