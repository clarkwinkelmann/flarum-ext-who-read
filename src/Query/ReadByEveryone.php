<?php

namespace ClarkWinkelmann\WhoRead\Query;

use Flarum\Discussion\Discussion;
use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;
use Flarum\Settings\SettingsRepositoryInterface;

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
class ReadByEveryone implements FilterInterface
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    )
    {
    }

    public function getFilterKey(): string
    {
        return 'readbyeveryone';
    }

    public function filter(SearchState $state, string|array $value, bool $negate): void
    {
        if (!$state->getActor()->hasPermission('who-read.seeRead')) {
            return;
        }

        $fullyReadQuery = Discussion::query()
            ->selectRaw('discussion_id, max(last_read_post_number) as last_read_post_number_by_anyone, last_post_number')
            ->join('discussion_user', 'discussion_user.discussion_id', '=', 'discussions.id')
            ->where('discussion_user.who_read_unread', false)
            ->whereNotNull('discussion_user.last_read_post_number');

        if ($groups = $this->settings->get('who-read.onlyGroups')) {
            $fullyReadQuery
                ->join('group_user', 'group_user.user_id', '=', 'discussion_user.user_id')
                ->whereIn('group_user.group_id', explode(',', $groups));
        }

        $fullyReadDiscussionIds = $fullyReadQuery
            ->groupBy('discussion_id')
            ->havingRaw('last_read_post_number_by_anyone >= last_post_number')
            ->pluck('discussion_id')
            ->all();

        $state
            ->getQuery()
            ->whereIn('id', $fullyReadDiscussionIds, 'and', $negate);
    }
}
