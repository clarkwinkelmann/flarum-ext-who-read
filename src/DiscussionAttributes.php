<?php

namespace ClarkWinkelmann\WhoRead;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Discussion\Discussion;

class DiscussionAttributes
{
    public function __invoke(DiscussionSerializer $serializer, Discussion $discussion)
    {
        $actor = $serializer->getActor();

        $attributes = [];

        if ($actor->hasPermission('who-read.markUnread')) {
            $attributes['whoReadCanMarkUnread'] = true;

            if ($state = $discussion->state) {
                $attributes['whoReadUnread'] = (bool)$state->who_read_unread;
            }
        }

        if (!$actor->hasPermission('who-read.seeRead')) {
            $discussion->setRelation('clarkwinkelmannWhoReaders', null);
        }

        return $attributes;
    }
}
