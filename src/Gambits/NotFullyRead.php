<?php

namespace ClarkWinkelmann\WhoRead\Gambits;

use Flarum\Discussion\Discussion;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Database\Query\Builder;

class NotFullyRead extends AbstractRegexGambit
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    protected function getGambitPattern()
    {
        return 'is:notfullyread';
    }

    public function apply(SearchState $search, $bit)
    {
        if (!$search->getActor()->hasPermission('who-read.seeRead')) {
            return false;
        }

        return parent::apply($search, $bit);
    }

    protected function conditions(SearchState $search, array $matches, $negate)
    {
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

        $search->getQuery()->where(function (Builder $query) use ($fullyReadDiscussionIds, $negate) {
            if (!$negate) {
                $query->whereNotIn('id', $fullyReadDiscussionIds);
            } else {
                $query->whereIn('id', $fullyReadDiscussionIds);
            }
        });
    }
}
