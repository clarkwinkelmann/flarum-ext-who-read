import Model from 'flarum/common/Model';
import User from 'flarum/common/models/User';

export default class UserState extends Model {
    last_read_at = Model.attribute<string>('last_read_at');
    last_read_post_number = Model.attribute<number | null>('last_read_post_number');
    subscription = Model.attribute<string | null>('subscription');
    unread = Model.attribute<boolean>('unread');
    user = Model.hasOne<User>('user');
}
