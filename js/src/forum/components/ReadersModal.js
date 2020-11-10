import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import AvatarsDetails from './AvatarsDetails';

/* global m */

const translationPrefix = 'clarkwinkelmann-who-read.forum.modal.';

export default class ReadersModal extends Modal {
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

    section(dataKey, translationKey) {
        if (!this.attrs[dataKey] || !this.attrs[dataKey].length) {
            return null;
        }

        return [
            m('h3', app.translator.trans(translationPrefix + translationKey)),
            AvatarsDetails.component({
                readers: this.attrs[dataKey],
            }),
        ];
    }
}
