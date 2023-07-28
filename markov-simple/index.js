class MarkovChain {
    constructor(order) {
        this.order = order;
        this.transitions = {};
    }

    train(text) {
        for (let i = 0; i < text.length - this.order; i++) {
            const context = text.slice(i, i + this.order);
            const nextLetter = text[i + this.order];

            if (!this.transitions[context]) {
                this.transitions[context] = {};
            }

            const contextTransitions = this.transitions[context];

            if (!contextTransitions[nextLetter]) {
                contextTransitions[nextLetter] = 0;
            }

            contextTransitions[nextLetter] += 1;
        }
    }

    generateMulti(length, iters, startContext){
        var res = [];
        for(var i=0;i<iters;i++){
            res.push(this.generate(length, startContext));
        }
        return res;
    }

    generate(length, _currentContext=null) {
        let currentContext = _currentContext || randomKey(this.transitions);
        let output = currentContext;

        const keys = Object.keys(this.transitions);

        for (let i = 0; i < length - this.order; i++) {
            const contextTransitions = this.transitions[currentContext];

            if (!contextTransitions || Object.keys(contextTransitions).length === 0) {
                break;
            }

            const nextLetter = this._weightedRandomChoice(contextTransitions);
            output += nextLetter;
            currentContext = currentContext.slice(1) + nextLetter;

            if (i === length - this.order - 1) {
                currentContext = randomKey(this.transitions);
            }
        }

        return output;
    }

    _weightedRandomChoice(contextTransitions) {
        let totalWeight = 0;
        for (const letter in contextTransitions) {
            totalWeight += contextTransitions[letter];
        }

        let randomWeight = Math.random() * totalWeight;
        let cumulativeWeight = 0;

        for (const letter in contextTransitions) {
            cumulativeWeight += contextTransitions[letter];
            if (cumulativeWeight >= randomWeight) {
                return letter;
            }
        }

        return null;
    }

    probabilityFromTo(stateA, stateB, ticks) {
        if (stateA.length !== this.order || stateB.length !== 1) {
            throw new Error('Invalid state lengths');
        }

        return this._probabilityFromToHelper(stateA, stateB, ticks);
    }

    _probabilityFromToHelper(currentState, targetState, remainingTicks) {
        if (remainingTicks === 0) {
            return 0;
        }

        const contextTransitions = this.transitions[currentState] || {};
        let totalTransitions = 0;

        for (const letter in contextTransitions) {
            totalTransitions += contextTransitions[letter];
        }

        if (totalTransitions === 0) {
            return 0;
        }

        let probability = 0;

        for (const letter in contextTransitions) {
            const tally = contextTransitions[letter];
            const nextState = currentState.slice(1) + letter;
            const weight = letter === targetState ? 1 : 0;

            probability +=
                (weight + this._probabilityFromToHelper(nextState, targetState, remainingTicks - 1)) * (tally / totalTransitions);
        }

        return probability;
    }
}

function randomKey(obj) {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
}

module.exports = {MarkovChain};
