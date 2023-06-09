# NetSuite Companion

NetSuite account customization assistant.

#### Note: Script is meant to run from your project's root folder

## Requirements

For usage, you will only need Node.js and a node global package manager installed in your environment.

## Install

    $ npm i -g netsuite-companion

## Commands

`nsc init` - Initialize boilerplate on the current working directory.

First time this command is run, questions will be asked about the
user and vendor (user's company). The results will be stored in ~/.netsuite-companion
and later used to generate the boilerplate files.

`nsc import record [url]` - Import a record definition from cache or URL
the [NetSuite Record Browser](https://system.netsuite.com/help/helpcenter/en_US/srbrowser/Browser2022_2/script/record/account.html)

`rebuild` - Rebuild type definitions for custom records, fields, and sublists in the project's Objects folder

`nsc add project` - Add a new project folder and README.md file to the vendor folder

`nsc add script` - Select a NetSuite script to generate .ts and .xml files. Use the `no-deploy` flag to skip creating the .xml

`nsc add type` - Add a types.d.ts file to the project

`nsc add api` - Add an API class file to interface with third party systems

`nsc add module` - Add a custom module file to the project

## TODO
- Add RESTlet testing framework
- Add opencommit to pipeline
- Add deploy commands with SDF
  - On deploy: remove all directories with only .gitignore && tsc && sdf push