<?php

namespace ClarkWinkelmann\WhoRead\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Discussion\UserState;

class UserStateSerializer extends AbstractSerializer
{
    protected $type = 'clarkwinkelmann-who-readers';

    /**
     * @param UserState $model
     * @return string
     */
    public function getId($model): string
    {
        return $model->user_id . '-' . $model->discussion_id;
    }

    /**
     * @param UserState $model
     * @return array
     */
    protected function getDefaultAttributes($model): array
    {
        $canSeeUnread = $this->actor->hasPermission('who-read.seeUnread');

        if (!$canSeeUnread && $model->who_read_unread) {
            return [
                'last_read_at' => null,
                'last_read_post_number' => null,
                'subscription' => null,
                'unread' => null,
            ];
        }

        return [
            'last_read_at' => $this->formatDate($model->last_read_at),
            'last_read_post_number' => $model->last_read_post_number,
            'subscription' => $this->actor->hasPermission('who-read.seeSubscription') ? $model->subscription : null,
            'unread' => $canSeeUnread ? $model->who_read_unread : null,
        ];
    }

    public function user($model)
    {
        return $this->hasOne($model, BasicUserSerializer::class);
    }
}
