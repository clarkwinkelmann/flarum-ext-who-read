<?php

namespace ClarkWinkelmann\WhoRead\Api;

use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Settings\SettingsRepositoryInterface;

class ForumResourceFields
{
    public function __invoke(): array
    {
        $actorSeesFeature = fn($f, Context $context) => $context->getActor()->hasPermission('who-read.seeRead');

        return [
            Schema\Boolean::make('who-read.canSee')
                ->visible($actorSeesFeature)
                ->get(fn() => true),
            Schema\Boolean::make('who-read.showInDiscussionList')
                ->visible($actorSeesFeature)
                ->get(fn() => resolve(SettingsRepositoryInterface::class)->get('who-read.showInDiscussionList')),
            Schema\Boolean::make('who-read.showInHero')
                ->visible($actorSeesFeature)
                ->get(fn() => resolve(SettingsRepositoryInterface::class)->get('who-read.showInHero')),
            Schema\Boolean::make('who-read.showBetweenPosts')
                ->visible($actorSeesFeature)
                ->get(fn() => resolve(SettingsRepositoryInterface::class)->get('who-read.showBetweenPosts')),
            Schema\Boolean::make('who-read.showCountOfReadersWhoStopped')
                ->visible($actorSeesFeature)
                ->get(fn() => resolve(SettingsRepositoryInterface::class)->get('who-read.showCountOfReadersWhoStopped')),
            Schema\Integer::make('who-read.hideWhenBehind')
                ->visible($actorSeesFeature)
                ->get(fn() => resolve(SettingsRepositoryInterface::class)->get('who-read.hideWhenBehind')),
            Schema\Integer::make('who-read.maxVisible')
                ->visible($actorSeesFeature)
                ->get(fn() => resolve(SettingsRepositoryInterface::class)->get('who-read.maxVisible')),
            Schema\Str::make('who-read.unreadIcon')
                ->visible($actorSeesFeature)
                // For this setting, we'll apply the default here, that way the admin settings stays empty and shows the placeholder
                ->get(fn() => resolve(SettingsRepositoryInterface::class)->get('who-read.unreadIcon') ?: 'fas fa-eye-slash'),
        ];
    }
}
