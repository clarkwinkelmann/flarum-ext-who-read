<?php

namespace ClarkWinkelmann\WhoRead\Extenders;

use Flarum\Discussion\Event\Saving;
use Flarum\Discussion\Event\UserDataSaving;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class SaveDiscussionUnread implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Saving::class, [$this, 'saving']);
    }

    public function saving(Saving $event)
    {
        $unread = Arr::get($event->data, 'attributes.whoReadUnread');

        if (!is_null($unread)) {
            $event->actor->assertCan('who-read.markUnread');

            $state = $event->discussion->stateFor($event->actor);
            $state->who_read_unread = $unread;

            /**
             * @var $dispatcher Dispatcher
             */
            $dispatcher = app(Dispatcher::class);

            $dispatcher->dispatch(
                new UserDataSaving($state)
            );

            $state->save();
        }
    }
}
