<?php

namespace ClarkWinkelmann\WhoRead;

use Flarum\Discussion\Discussion;
use Flarum\Discussion\UserState;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class DiscussionReaderRelationship
{
    public function __invoke(Discussion $discussion)
    {
        $relationship = $discussion->hasMany(UserState::class)
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
