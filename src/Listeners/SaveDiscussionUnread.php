<?php

namespace ClarkWinkelmann\WhoRead\Listeners;

use Flarum\Discussion\Event\Saving;
use Flarum\Discussion\Event\UserDataSaving;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class SaveDiscussionUnread
{
    protected $events;

    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }

    public function handle(Saving $event)
    {
        $unread = Arr::get($event->data, 'attributes.whoReadUnread');

        if (!is_null($unread)) {
            $event->actor->assertCan('who-read.markUnread');

            $state = $event->discussion->stateFor($event->actor);
            $state->who_read_unread = $unread;

            $this->events->dispatch(
                new UserDataSaving($state)
            );

            $state->save();
        }
    }
}
