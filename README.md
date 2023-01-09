# NetSuite Companion

NetSuite account customization assistant.

# TODO
Type definitions for sublists are correcrt
API file has an interface class
make sure README follows best practices
netsuite version alignns to current

## Requirements

Here you should give a general idea of what a user will need in order to use your library or application. List
requirements and then link to another resource with detailed installation or setup instructions.

- Requirement one
- Another requirement

Check the [installation notes]() for more details on how to install the project.

## Usage

Note: Script is to run from the project's root folder

Include here a few examples of commands you can run and what they do. Finally link out to a resource to learn more (next
paragraph).

### Commands

`nsc init` - Initialize a new project on the current folder

`nsc import record` - Import a record definition from cache or URL
the [NetSuite Record Browser](https://system.netsuite.com/help/helpcenter/en_US/srbrowser/Browser2022_2/script/record/account.html)

`rebuild` - Rebuild type definitions for custom records, fields, and sublists in the Objects folder

`nsc add project` - Add a new project folder and README.md file to the vendor folder

`nsc add script` - Select a NetSuite script to generate .ts and .xml files

`nsc add types` - Add a types.d.ts file to the project

`nsc add api` - Add an API class file to interface with third party systems

`nsc add module` - Add a custom module file to the project