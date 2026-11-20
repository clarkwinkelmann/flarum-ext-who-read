import Extend from 'flarum/common/extenders';
import Discussion from 'flarum/common/models/Discussion';
import UserState from './models/UserState';
import ReadByEveryoneGambit from './query/ReadByEveryoneGambit';

export default [
    new Extend.Store()
        .add('clarkwinkelmann-who-readers', UserState),
    new Extend.Model(Discussion)
        .hasMany('clarkwinkelmannWhoReaders'),
    new Extend.Search()
        .gambit('discussions', ReadByEveryoneGambit),
];
