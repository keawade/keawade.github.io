---
layout: post
title: 'Advent of Code - Day 2: I Was Told There Would Be No Math'
date: 2015-12-28 00:30:00
tags: [Node.js, Python, programming, Advent of Code]
comments: true
---

The elves have run out of wrapping paper and ribbon! For this puzzle we are given the dimensions of a bunch of presents as a list of strings and are asked to compute how much wrapping paper and ribbon should be ordered to wrap the remaining presents.

Get your own puzzle input and record your progress over at [Advent of Code](http://adventofcode.com/)!
<!--more-->

# Part 1

## Problem

>The elves are running low on wrapping paper, and so they need to submit an order for more. They have a list of the dimensions (length l, width w, and height h) of each present, and only want to order exactly as much as they need.
>
>Fortunately, every present is a box (a perfect [right rectangular prism](https://en.wikipedia.org/wiki/Cuboid#Rectangular_cuboid)), which makes calculating the required wrapping paper for each gift a little easier: find the surface area of the box, which is `2*l*w + 2*w*h + 2*h*l`. The elves also need a little extra paper for each present: the area of the smallest side.
>
>All numbers in the elves' list are in feet. How many total **square feet of wrapping paper** should they order?

## Methodology
I handled the solutions for Node and Python slightly differently because of syntatic differences. Despite these slight changes, the general approach is still the same. I will describe my methodology in terms of the Node.js code.

First, I read in the source from `source/day2source.txt` and `split()` the string on the new line character, `\n`. I assign this output to the variable `source`. This variable is an array with each element of that array containing the string from each line of the original file.

Next, I create the variable `total` to store the running total of how much wrapping paper we need.

Now that I have my `source` variable and `total` counter, I loop through the array elements of `source`. On each iteration I split the substring in the array element on the character `x`, find the three side sizes, assign them to temporary variables (`s1`, `s2`, `s3`), and then find the smallest of the six sides and store it in the temporary variable `smallest`.

Finally, I add up the dimensions using the given formula and add `smallest` as asked. I then add this value to the current value of `total`. After iterating through all the array elements, I print out the final value of `total`.

## Solutions

### Node.js
{% highlight js linenos %}
var fs = require('fs')

var source = fs.readFileSync('../source/day2source.txt').toString().split('\n')
var total = 0
for (var i = 0; i < source.length - 1; i++) {
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
This time I need to compare the widths of the packages instead of their face areas. I also need to find the two smallest widths rather than just the smallest. Finally, instead of finding surface area, I need to find a length of ribbon using the given formula.

## Solutions

### Node.js
{% highlight js linenos %}
var fs = require('fs')

var source = fs.readFileSync('../source/day2source.txt').toString().split('\n')
var total = 0
for (var i = 0; i < source.length - 1; i++) {
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
