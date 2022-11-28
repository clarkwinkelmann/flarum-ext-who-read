import UserState from '../models/UserState';

export default function (readers: (UserState | undefined)[] | false): UserState[] {
    if (readers === false) {
        return [];
    }

    // @ts-ignore for some reason typescript cannot understand this works
    return readers.filter(reader => typeof reader !== 'undefined');
}
