+++
title = "Advent of Code: Not Quite Lisp"
date = 2015-12-27
slug = "2015-12-27-Advent_of_Code"
+++

[Eric Wastl](http://was.tl/) has created a series of holiday themed programming exercises over at [Advent of Code](http://adventofcode.com/) and I thought it would be fun to post my solutions to these exercises now that they have all been released. I'll be posting more of my solutions as I have time to write up my methodologies (and complete some of them).

The first set of puzzles involves Santa navigating an infinite high-rise building with and infinite basement. Santa is given instructions in the form of a string of parentheses which tell him to go up or down one floor.

# Part 1

## Problem

>Santa is trying to deliver presents in a large apartment building, but he can't find the right floor - the directions he got are a little confusing. He starts on the ground floor (floor `0`) and then follows the instructions one character at a time.
>
>An opening parenthesis, `(`, means he should go up one floor, and a closing parenthesis, `)`, means he should go down one floor.
>
>The apartment building is very tall, and the basement is very deep; he will never find the top or bottom floors.

## Methodology
Both of these solutions follow the same basic formula. First, I read in the input that I've saved in `source/day1source.txt` and assign it to a variable. Next, I create a variable to hold the value of the current floor. I then use a loop to loop through each character in the string. For each character I check if the instruction is to go up one floor and if it is, I increment the `floor` variable by 1, otherwise I decrement the `floor` variable by 1. When the loop completes going through all the characters, I print out the final `floor` variable value.

## Solutions

### Node.js
```js
var fs = require('fs')

var source = fs.readFileSync('../source/day1source.txt').toString()
var end = source.length
var floor = 1
for (var i = 0; i < end; i++) {
  if (source.charAt(i) === '(') {
    floor++
  } else {
    floor--
  }
}
console.log('Santa ends up on floor ' + floor)
```

### Python
```python
filename = '../source/day1source.txt'

with open(filename) as f:
    source = [line.rstrip('\n') for line in open(filename)]

floor = 0

for line in source:
    for char in line:
        if char == '(':
            floor = floor + 1
        else:
            floor = floor - 1

print "Santa ends up on floor", floor
```

# Part 2

## Problem
>Now, given the same instructions, find the position of the first character that causes him to enter the basement (floor `-1`). The first character in the instructions has position `1`, the second character has position `2`, and so on.

## Methodology
To solve this, I modified my code to detect when the `floor` variable equals `-1` and prints out the current position in the string.

## Solutions

### Node.js
```js
var fs = require('fs')

var source = fs.readFileSync('../source/day1source.txt').toString()
var end = source.length
var floor = 1
for (var i = 0; i < end; i++) {
  if (source.charAt(i) === '(') {
    floor++
  } else {
    floor--
  }
  if (floor === -1) {
    console.log('The character ' + source.charAt(i) + ' at position ' + i + ' sent santa to the basement.')
  }
}
```

### Python
```python
filename = '../source/day1source.txt'

with open(filename) as f:
    source = [line.rstrip('\n') for line in open(filename)]

floor = 0
count = 0

for line in source:
    for char in line:
        if char == '(':
            floor = floor + 1
        else:
            floor = floor - 1
        count = count + 1
        if floor == -1:
            print "Santa enters the basement on instruction", count
            break
```
