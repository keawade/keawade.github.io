---
layout: post
title: 'Advent of Code - Day 2: I Was Told There Would Be No Math'
date: 2015-12-28 00:30:00
tags: [Node.js, Python, programming, Advent of Code]
comments: true
---

SECOND PUZZLE
This first set of puzzles involves Santa navigating an infinite high-rise building with and infinite basement. Santa is given instructions in the form of a string of parentheses which tell him to go up or down one floor.

<!--more-->

# Part 1

## Problem

>The elves are running low on wrapping paper, and so they need to submit an order for more. They have a list of the dimensions (length l, width w, and height h) of each present, and only want to order exactly as much as they need.
>
>Fortunately, every present is a box (a perfect [right rectangular prism](https://en.wikipedia.org/wiki/Cuboid#Rectangular_cuboid)), which makes calculating the required wrapping paper for each gift a little easier: find the surface area of the box, which is `2*l*w + 2*w*h + 2*h*l`. The elves also need a little extra paper for each present: the area of the smallest side.
>
>All numbers in the elves' list are in feet. How many total **square feet of wrapping paper** should they order?

## Methodology


## Solutions

### Node.js
{% highlight js linenos %}
var fs = require('fs')

var source = fs.readFileSync('../source/day2source.txt').toString().split('\n')
var end = source.length
var total = 0
for (var i = 0; i < end - 1; i++) {
  var tempDim = source[i].split('x')
  var s1 = Number(tempDim[0]) * Number(tempDim[1])
  var s2 = Number(tempDim[2]) * Number(tempDim[1])
  var s3 = Number(tempDim[0]) * Number(tempDim[2])

  var smallest = 0

  if (s1 > s2) {
    if (s2 > s3) {
      smallest = s3
    } else {
      smallest = s2
    }
  } else {
    if (s1 > s3) {
      smallest = s3
    } else {
      smallest = s1
    }
  }

  total = total + (2 * s1 + 2 * s2 + 2 * s3 + smallest)
}

console.log('The elves need to order ' + total + ' square feet of wrapping paper.')
{% endhighlight %}

### Python
{% highlight python linenos %}
filename = '../source/day2source.txt'

with open(filename) as f:
    source = [line.rstrip('\n') for line in open(filename)]

total = 0

for line in source:
    temp = line.split('x')
    s1 = int(temp[0]) * int(temp[1])
    s2 = int(temp[2]) * int(temp[1])
    s3 = int(temp[0]) * int(temp[2])

    if s1 > s2:
        if s2 > s3:
            smallest = s3
        else:
            smallest = s2
    else:
        if s1 > s3:
            smallest = s3
        else:
            smallest = s1
    total = total + (2*s1 + 2* s2 + 2*s3 + smallest)

print "The elves need to order", total, "square feet of wrapping paper"
{% endhighlight %}

# Part 2

## Problem
>The elves are also running low on ribbon. Ribbon is all the same width, so they only have to worry about the length they need to order, which they would again like to be exact.
>
>The ribbon required to wrap a present is the shortest distance around its sides, or the smallest perimeter of any one face. Each present also requires a bow made out of ribbon as well; the feet of ribbon required for the perfect bow is equal to the cubic feet of volume of the present. Don't ask how they tie the bow, though; they'll never tell.
>
>How many total **feet of ribbon** should they order?

## Methodology


## Solutions

### Node.js
{% highlight js linenos %}
var fs = require('fs')

var source = fs.readFileSync('../source/day2source.txt').toString().split('\n')
var end = source.length
var total = 0
for (var i = 0; i < end - 1; i++) {
  var tempDim = source[i].split('x')
  var s1 = Number(tempDim[0])
  var s2 = Number(tempDim[1])
  var s3 = Number(tempDim[2])

  var smallest = 0
  var nextSmallest = 0

  if (s1 > s2) {
    if (s2 > s3) {
      smallest = s3
      nextSmallest = s2
    } else {
      smallest = s2
      if (s1 > s3) {
        nextSmallest = s3
      } else {
        nextSmallest = s1
      }
    }
  } else {
    if (s1 > s3) {
      smallest = s3
      nextSmallest = s1
    } else {
      smallest = s1
      if (s2 > s3) {
        nextSmallest = s3
      } else {
        nextSmallest = s2
      }
    }
  }

  total = total + (smallest * 2) + (nextSmallest * 2) + (s1 * s2 * s3)
}

console.log('The elves need to order ' + total + ' feet of ribbon.')
{% endhighlight %}

### Python
{% highlight python linenos %}
filename = '../source/day2source.txt'

with open(filename) as f:
    source = [line.rstrip('\n') for line in open(filename)]

total = 0

for line in source:
    temp = line.split('x')
    s1 = int(temp[0])
    s2 = int(temp[1])
    s3 = int(temp[2])

    if s1 > s2:
        if s2 > s3:
            smallest = s3
            nextSmallest = s2
        else:
            smallest = s2
            if s1 > s3:
                nextSmallest = s3
            else:
                nextSmallest = s1
    else:
        if s1 > s3:
            smallest = s3
            nextSmallest = s1
        else:
            smallest = s1
            if s2 > s3:
                nextSmallest = s3
            else:
                nextSmallest = s2

    total = total + smallest*2 + nextSmallest*2 + s1*s2*s3

print "The elves need to order", total, "square feet of wrapping paper"
{% endhighlight %}
