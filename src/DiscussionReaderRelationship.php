<?php

namespace ClarkWinkelmann\WhoRead;

use Flarum\Discussion\Discussion;
use Flarum\Discussion\UserState;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiscussionReaderRelationship
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(Discussion $discussion): HasMany
    {
        $relationship = $discussion->hasMany(UserState::class)
            ->whereNotNull('last_read_post_number')
            ->orderBy('last_read_post_number', 'desc')
            ->orderBy('last_read_at', 'desc');

        if ($groups = $this->settings->get('who-read.onlyGroups')) {
            $relationship->whereHas('user.groups', function (Builder $query) use ($groups) {
                $query->whereIn('id', explode(',', $groups));
            });
        }

        return $relationship;
    }
}
