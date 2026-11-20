import app from 'flarum/forum/app';
import {BooleanGambit} from 'flarum/common/query/IGambit';

export default class ReadByEveryoneGambit extends BooleanGambit {
    key(): string {
        return app.translator.trans('clarkwinkelmann-who-read.lib.gambits.discussions.readbyeveryone.key', {}, true);
    }

    filterKey(): string {
        return 'readbyeveryone';
    }

    enabled(): boolean {
        return app.forum.attribute('who-read.canSee');
    }
}
