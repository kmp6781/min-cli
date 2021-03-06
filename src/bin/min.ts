#!/usr/bin/env node

import * as fs from 'fs-extra'
import * as path from 'path'
import * as _ from 'lodash'
import * as program from 'commander'
import { config } from '../util'
import commands from '../index'

const minPkg = require('../../package.json')
const proPkgPath = path.join(config.cwd, 'package.json')
const proPkg = fs.existsSync(proPkgPath) ? require(proPkgPath) : null

program
  .version(minPkg.version)
  .usage('<command> [options]')

commands.forEach(command => {
  // check
  if (proPkg && command.isAvailable) {
    command.isAvailable(proPkg['dev-type'] || {})
  }

  // create command
  let cmd = program.command(command.name)

  // set alias
  if (command.alias) {
    cmd.alias(command.alias)
  }

  // set usage
  if (command.usage) {
    cmd.usage(command.usage)
  }

  // set description
  if (command.description) {
    cmd.description(command.description)
  }

  // set options
  if (command.options && command.options.length) {
    let options: string[][] = command.options
    options.forEach((option: string[]) => {
      cmd.option(option[0], option[1])
    })
  }

  // set on
  if (_.isObject(command.on)) {
    _.forIn(command.on, (value, key) => {
      cmd.on(key, value)
    })
  }

  // set action
  if (command.action) {
    cmd.action(command.action)
  }
})

if (process.argv.length === 2) {
  program.outputHelp()
}

program.parse(process.argv)
