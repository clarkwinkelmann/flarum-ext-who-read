<?php

namespace ClarkWinkelmann\WhoRead;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;

class ForumAttributes
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(ForumSerializer $serializer): array
    {
        if (!$serializer->getActor()->hasPermission('who-read.seeRead')) {
            return [];
        }

        return [
            'who-read.canSee' => true,
            'who-read.showInDiscussionList' => (bool)$this->settings->get('who-read.showInDiscussionList', true),
            'who-read.showInHero' => (bool)$this->settings->get('who-read.showInHero', true),
            'who-read.showBetweenPosts' => (bool)$this->settings->get('who-read.showBetweenPosts', true),
            'who-read.showCountOfReadersWhoStopped' => (bool)$this->settings->get('who-read.showCountOfReadersWhoStopped', false),
            'who-read.hideWhenBehind' => (int)$this->settings->get('who-read.hideWhenBehind', 0),
            'who-read.maxVisible' => (int)$this->settings->get('who-read.maxVisible', 10),
            'who-read.unreadIcon' => $this->settings->get('who-read.unreadIcon') ?: 'fas fa-eye-slash',
        ];
    }
}
