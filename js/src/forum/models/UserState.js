import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class UserState extends mixin(Model, {
    last_read_at: Model.attribute('last_read_at'),
    last_read_post_number: Model.attribute('last_read_post_number'),
    subscription: Model.attribute('subscription'),
    user: Model.hasOne('user'),
}) {
    //
}
