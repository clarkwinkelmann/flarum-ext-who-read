<?php

namespace ClarkWinkelmann\WhoRead\Extenders;

use ClarkWinkelmann\WhoRead\Gambits\NotFullyRead;
use Flarum\Event\ConfigureDiscussionGambits;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class AddGambits implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(ConfigureDiscussionGambits::class, [$this, 'addDiscussionGambits']);
    }

    public function addDiscussionGambits(ConfigureDiscussionGambits $event)
    {
        $event->gambits->add(NotFullyRead::class);
    }
}
