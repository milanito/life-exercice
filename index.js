#!/usr/bin/env node

const Promise = require('bluebird');
const lineReader = require('line-reader')
const { split, reduce, map, get, has, sortBy, keys, forEach, filter, size } = require('lodash')

const fs = Promise.promisifyAll(require('fs'))

const start = async () => {
  const file = await fs.readFileAsync(__dirname + '/liste.de.mots.francais.frgut.txt', 'utf8')

  const results = reduce(split(file, '\n'), (accumulator, line) => {
    const letterFrequences = {}

    forEach(split(line, ''), char => {
      if (has(letterFrequences, char.charCodeAt(0))) {
        const freq = letterFrequences[char.charCodeAt(0)]
        letterFrequences[char.charCodeAt(0)] = freq + 1
      } else {
        letterFrequences[char.charCodeAt(0)] = 1
      }
    })
    const freqKey = reduce(sortBy(keys(letterFrequences)), (acc, key) =>
      `${acc}-${key}${letterFrequences[key]}`)

    if (has(accumulator, freqKey)) {
      accumulator[freqKey] = [...accumulator[freqKey], line]
    } else {
      accumulator[freqKey] = [line]
    }

    return accumulator
  }, {})

  console.log(filter(map(results, value => value), arr => size(arr) > 1))
}

start()
