import Model from 'flarum/common/Model';

export default class UserState extends Model {
    last_read_at = Model.attribute('last_read_at');
    last_read_post_number = Model.attribute('last_read_post_number');
    subscription = Model.attribute('subscription');
    unread = Model.attribute('unread');
    user = Model.hasOne('user');
}
