<?php

namespace ClarkWinkelmann\WhoRead\Api;

use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\UserDataSaving;
use Illuminate\Contracts\Events\Dispatcher;

class DiscussionResourceFields
{
    public function __invoke(): array
    {
        return [
            Schema\Relationship\ToMany::make('clarkwinkelmannWhoReaders')
                ->type('clarkwinkelmann-who-readers')
                ->get(function (Discussion $discussion, Context $context) {
                    // This empty return serves 2 functions
                    // It's the permission check, to make sure people who don't have access cannot see it
                    // But it's also the second part of the performance improvement for the eagerLoad call in the endpoint
                    if (!$context->getActor()->hasPermission('who-read.seeRead')) {
                        return [];
                    }

                    return $discussion->clarkwinkelmannWhoReaders->all();
                })
                ->includable(),
            Schema\Boolean::make('whoReadCanMarkUnread')
                ->visible(fn($d, Context $context) => $context->getActor()->hasPermission('who-read.markUnread'))
                ->get(fn() => true),
            Schema\Boolean::make('whoReadUnread')
                ->visible(fn(Discussion $discussion, Context $context) => $context->getActor()->hasPermission('who-read.markUnread') && $discussion->state)
                ->get(fn(Discussion $discussion) => $discussion->state?->who_read_unread)
                ->writable(fn($d, Context $context) => $context->getActor()->can('who-read.markUnread') && $context->updating())
                ->set(function (Discussion $discussion, $value, Context $context) {
                    $state = $discussion->stateFor($context->getActor());
                    $state->who_read_unread = (bool)$value;

                    // There doesn't seem to be a clea guidance on when this event should be dispatched
                    // It's dispatched in Flarum\Discussion\Command\ReadDiscussionHandler, but not in Flarum\Subscriptions\Listener\SaveSubscriptionToDatabase
                    // since we deal with read status, we'll dispatch it as well
                    resolve(Dispatcher::class)->dispatch(
                        new UserDataSaving($state)
                    );

                    $state->save();
                }),
        ];
    }
}
