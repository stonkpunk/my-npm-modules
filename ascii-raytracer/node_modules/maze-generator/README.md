# Maze Generator [![Build Status](https://travis-ci.org/romainberger/maze-generator.png?branch=master)](https://travis-ci.org/romainberger/maze-generator)

Generate random maze

## Installation

    npm install maze-generator

## Usage

Simply require the generator. You can then call it giving the dimensions of the maze you want in an array as first argument. It will return the grid generated

    var generator = require('maze-generator')

    // generate a maze of 20 cells by 20 cells
    var maze = generator([20, 20])

## Improvement

For now the generator only works with the [recursing backtracking algorithm](http://en.wikipedia.org/wiki/Backtracking). But the module is written in a way to easily add other algorithm (I might add some in the future).
