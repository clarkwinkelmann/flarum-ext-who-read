import {override} from 'flarum/extend';
import Translator from 'flarum/Translator';

export default function () {
    /**
     * There is a bug in Flarum's pluralize function
     * Explicit rules are added as keys to an array object, which is then looped through via .forEach
     * As the array is always empty, those rules are never evaluated
     * Additionally the values returned inside .forEach would never be returned as the function return value either
     */
    override(Translator.prototype, 'pluralize', function (original, translation, number) {
        const sPluralRegex = new RegExp(/^\w+\: +(.+)$/),
            cPluralRegex = new RegExp(/^\s*((\{\s*(\-?\d+[\s*,\s*\-?\d+]*)\s*\})|([\[\]])\s*(-Inf|\-?\d+)\s*,\s*(\+?Inf|\-?\d+)\s*([\[\]]))\s?(.+?)$/),
            iPluralRegex = new RegExp(/^\s*(\{\s*(\-?\d+[\s*,\s*\-?\d+]*)\s*\})|([\[\]])\s*(-Inf|\-?\d+)\s*,\s*(\+?Inf|\-?\d+)\s*([\[\]])/),
            standardRules = [],
            explicitRules = {};

        translation.split('|').forEach(part => {
            if (cPluralRegex.test(part)) {
                const matches = part.match(cPluralRegex);
                explicitRules[matches[0]] = matches[matches.length - 1];
            } else if (sPluralRegex.test(part)) {
                const matches = part.match(sPluralRegex);
                standardRules.push(matches[1]);
            } else {
                standardRules.push(part);
            }
        });

        for (let e in explicitRules) {
            if (explicitRules.hasOwnProperty(e) && iPluralRegex.test(e)) {
                const matches = e.match(iPluralRegex);

                if (matches[1]) {
                    const ns = matches[2].split(',');

                    for (let n in ns) {
                        if (number === parseInt(ns[n])) {
                            return explicitRules[e];
                        }
                    }
                } else {
                    const leftNumber = this.convertNumber(matches[4]);
                    const rightNumber = this.convertNumber(matches[5]);

                    if (('[' === matches[3] ? number >= leftNumber : number > leftNumber) &&
                        (']' === matches[6] ? number <= rightNumber : number < rightNumber)) {
                        return explicitRules[e];
                    }
                }
            }
        }

        return standardRules[this.pluralPosition(number, this.locale)] || standardRules[0] || undefined;
    });
}
