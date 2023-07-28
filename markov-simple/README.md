# markov-simple

yet another markov chain tool for text, very simple, no tokenization; degree-n memos predict individual characters; includes utils to predict probabilities.

## Installation

```sh
npm i markov-simple
```

## Usage 

```javascript
var MarkovChain = require('markov-simple').MarkovChain;

//a story about a cat who loves markov chains

const inputText = `Once upon a time in March, in a cozy little house on the outskirts of town, there lived a cat named Whiskers. Whiskers was a curious cat who loved to explore and discover new things. One day, while Whiskers was taking a nap on the windowsill, he overheard his owner talking about a new algorithm called "Markov Chains." Intrigued, Whiskers set out to learn more about this fascinating concept.
Whiskers spent hours reading books and articles about Markov Chains, and he became fascinated with the idea of using probability to predict the future. He learned that Markov Chains could be used to generate new sentences, music, and even images.
Whiskers was so fascinated by Markov Chains that he decided to create his own Markov Chain generator. He spent many long nights programming and tweaking his algorithm until it was perfect.
As he generated new phrases and sentences using his Markov Chain algorithm, Whiskers felt a sense of satisfaction that he had never felt before. He loved the way that the algorithm was able to take a simple input and generate something entirely new and unpredictable.
Eventually, Whiskers became so good at generating phrases and sentences using his Markov Chain algorithm that he started using it to communicate with his owner. He would generate random phrases and meows that his owner would try to interpret, and they would spend hours playing this game.
Whiskers continued to use his Markov Chain algorithm to explore and discover new things. He was constantly amazed at the new and unpredictable things that the algorithm could create. In the end, Whiskers realized that he loved Markov Chains more than anything else in the world, and he was grateful to have discovered this fascinating algorithm.`;

var markovOrder = 3; //number of letters per "record"
const markov = new MarkovChain(markovOrder);
markov.train(inputText.toLowerCase());

var startContext = "mar"; //we want strings that start with "a " [length of context must be same as markovOrder!] - default null
var lengthOfOutput = 50;
var nOutputsToGenerate = 3;
var generatedTextSingle = markov.generate(lengthOfOutput, startContext);
var generatedTextMulti = markov.generateMulti(lengthOfOutput, nOutputsToGenerate, startContext);
var nSteps = 3;
var probOfChange = markov.probabilityFromTo("mar", "v", nSteps); //0.9
console.log({generatedTextSingle, probOfChange});

// {
//     generatedTextSingle: 'markov chains talking his felt and discover felt a',
//     probOfChange: 0.9 //notice how "mar" occurs 10 times in the input text -- once "march" + 9 times "markov" -- 90% of the time "v" is within 3 steps of "mar" 
// }

// console.log(generatedTextMulti); //array of random outputs

// console.log(markov.transitions); //markov 'transitions' memory order-n mapped to individual chars

// {
//     onc: { e: 2 },
//     nce: { ' ': 1, p: 1, s: 3 },
//     'ce ': { u: 1 },
//     'e u': { p: 1, s: 1 },
//     ' up': { o: 1 },
//     upo: { n: 1 },
//     pon: { ' ': 1 },
```

## Similar Tools

- [general-markov](https://www.npmjs.com/package/general-markov) 
- [markov-strings](https://www.npmjs.com/package/markov-strings) 



[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



