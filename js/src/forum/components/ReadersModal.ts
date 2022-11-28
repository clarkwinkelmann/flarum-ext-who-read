import app from 'flarum/forum/app';
import Modal, {IInternalModalAttrs} from 'flarum/common/components/Modal';
import AvatarsDetails from './AvatarsDetails';
import UserState from '../models/UserState';

const translationPrefix = 'clarkwinkelmann-who-read.forum.modal.';

type Section = 'readersUntilHereOnly' | 'readersFurther' | 'readersEnd' | 'readersBehind';

type ReadersModalAttrs = IInternalModalAttrs & {
    [key in Section]: UserState[];
};

export default class ReadersModal extends Modal<ReadersModalAttrs> {
    className() {
        return 'ReadersModal';
    }

    title() {
        return app.translator.trans(translationPrefix + 'title');
    }

    content() {
        return m('.Modal-body', [
            this.section('readersUntilHereOnly', 'up-to-this-post'),
            this.section('readersFurther', 'past-this-post'),
            this.section('readersEnd', 'to-the-end'),
            this.section('readersBehind', 'behind'),
        ]);
    }

    section(dataKey: Section, translationKey: string) {
        if (!this.attrs[dataKey] || !this.attrs[dataKey].length) {
            return null;
        }

        return [
            m('h3', app.translator.trans(translationPrefix + translationKey)),
            m(AvatarsDetails, {
                readers: this.attrs[dataKey],
            }),
        ];
    }
}
