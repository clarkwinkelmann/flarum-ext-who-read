<?php

namespace ClarkWinkelmann\WhoRead\Api;

use Flarum\Api\Context;
use Flarum\Api\Resource\AbstractDatabaseResource;
use Flarum\Api\Schema;
use Flarum\Discussion\UserState;
use Tobyz\JsonApiServer\Context as JsonApiContext;

class UserStateResource extends AbstractDatabaseResource
{
    public function type(): string
    {
        return 'clarkwinkelmann-who-readers';
    }

    public function model(): string
    {
        return UserState::class;
    }

    /**
     * @param UserState $model
     * @param JsonApiContext $context
     * @return string
     */
    public function getId(object $model, JsonApiContext $context): string
    {
        return $model->user_id . '-' . $model->discussion_id;
    }

    public function fields(): array
    {
        // We don't want the payload to change too much between those who have or don't have the seeUnread permission
        // So we'll show the attribute to everyone, but force the value to null when you're not supposed to see the flag
        $nullForThoseWhoCannotSeeUnreadStatus = function (UserState $model, Context $context) {
            if (!$context->getActor()->hasPermission('who-read.seeUnread') && $model->who_read_unread) {
                return null;
            }

            return $model->{$this->property($context->field)};
        };

        return [
            Schema\DateTime::make('last_read_at')
                ->visible()
                ->nullable()
                ->get($nullForThoseWhoCannotSeeUnreadStatus),
            Schema\Integer::make('last_read_post_number')
                ->visible()
                ->nullable()
                ->get($nullForThoseWhoCannotSeeUnreadStatus),
            Schema\Boolean::make('unread')
                ->visible(fn($m, Context $context) => $context->getActor()->hasPermission('who-read.seeUnread'))
                ->get(fn(UserState $model) => $model->who_read_unread),
            Schema\Str::make('subscription')
                ->visible(fn($m, Context $context) => $context->getActor()->hasPermission('who-read.seeSubscription')),
            Schema\Relationship\ToOne::make('user')
                ->type('users')
                ->includable()
        ];
    }
}
