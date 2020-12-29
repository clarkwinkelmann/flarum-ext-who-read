<?php

namespace ClarkWinkelmann\WhoRead;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;

class ForumAttributes
{
    public function __invoke(ForumSerializer $serializer)
    {
        if (!$serializer->getActor()->hasPermission('who-read.seeRead')) {
            return [];
        }

        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = app(SettingsRepositoryInterface::class);

        return [
            'who-read.canSee' => true,
            'who-read.showInDiscussionList' => (bool)$settings->get('who-read.showInDiscussionList', true),
            'who-read.showInHero' => (bool)$settings->get('who-read.showInHero', true),
            'who-read.showBetweenPosts' => (bool)$settings->get('who-read.showBetweenPosts', true),
            'who-read.showCountOfReadersWhoStopped' => (bool)$settings->get('who-read.showCountOfReadersWhoStopped', false),
            'who-read.hideWhenBehind' => (int)$settings->get('who-read.hideWhenBehind', 0),
            'who-read.maxVisible' => (int)$settings->get('who-read.maxVisible', 10),
            'who-read.unreadIcon' => $settings->get('who-read.unreadIcon') ?: 'fas fa-eye-slash',
        ];
    }
}
