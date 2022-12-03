import matchwords from 'match-words';

export default (str)=> {
    if (typeof str !== 'string') {
        throw new TypeError('expected a string');
    }
    const words = matchwords(str);
    if (!words) {
        return {};
    }
    return words.reduce((map, word)=>{
        const count = (map[word] || 0) + 1;
        map[word] = count;
        return map;
    }, {});
};
