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
    public function getId($model)
    {
        return $model->user_id . '-' . $model->discussion_id;
    }

    /**
     * @param UserState $model
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        return [
            'last_read_at' => $this->formatDate($model->last_read_at),
            'last_read_post_number' => $model->last_read_post_number,
            'subscription' => $this->actor->hasPermission('who-read.seeSubscription') ? $model->subscription : null,
        ];
    }

    public function user($model)
    {
        return $this->hasOne($model, BasicUserSerializer::class);
    }
}
