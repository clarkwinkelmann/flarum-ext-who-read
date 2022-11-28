import UserState from './src/forum/models/UserState';

declare module 'flarum/common/models/Discussion' {
    export default interface Discussion {
        clarkwinkelmannWhoReaders(): (UserState | undefined)[] | false
    }
}
