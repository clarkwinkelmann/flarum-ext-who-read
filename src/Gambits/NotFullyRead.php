<?php

namespace ClarkWinkelmann\WhoRead\Gambits;

use Flarum\Discussion\Discussion;
use Flarum\Discussion\Search\DiscussionSearch;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\AbstractSearch;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Database\Query\Builder;
use LogicException;

class NotFullyRead extends AbstractRegexGambit
{
    protected $pattern = 'is:notfullyread';

    public function apply(AbstractSearch $search, $bit)
    {
        if (!$search->getActor()->hasPermission('who-read.seeRead')) {
            return false;
        }

        return parent::apply($search, $bit);
    }

    protected function conditions(AbstractSearch $search, array $matches, $negate)
    {
        if (!$search instanceof DiscussionSearch) {
            throw new LogicException('This gambit can only be applied on a DiscussionSearch');
        }

        $fullyReadQuery = Discussion::query()
            ->selectRaw('discussion_id, max(last_read_post_number) as last_read_post_number_by_anyone, last_post_number')
            ->join('discussion_user', 'discussion_user.discussion_id', '=', 'discussions.id')
            ->where('discussion_user.who_read_unread', false)
            ->whereNotNull('discussion_user.last_read_post_number');

        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = app(SettingsRepositoryInterface::class);

        if ($groups = $settings->get('who-read.onlyGroups')) {
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
