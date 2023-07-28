# name-my-computer

give your computer a human name, based on its mac address. 


>give your computer<br/>
>a personality by<br/>
>giving it a name! ✨💻😊<br/>
> 
> -- <cite>ancient haiku</cite>

great for remembering machines within a cluster.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Is it dangerous to post my MAC address publically?](#is-it-dangerous-to-post-my-mac-address-publically)

## Installation

```sh
npm i name-my-computer
```

## Usage

```javascript
console.log(require('name-my-computer').getName());
//returns "Bill Biffoli"
```

## Is it dangerous to post my MAC address publically?

[Not really](https://security.stackexchange.com/questions/67893/is-it-dangerous-to-post-my-mac-address-publicly). But you can use the `salt` param to make it impossible to guess the MAC from the generated name. The `salt` is appended to the MAC address before generating the result. The salt is blank by default.

```javascript
var salt = "12345";
console.log(require('name-my-computer').getName(salt)); 
//returns "Eula Tucci"

//suppose we want to convert some arbitrary input [rather than the mac address], into a name...
//console.log(require('name-my-computer').getName(salt, input));
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)


