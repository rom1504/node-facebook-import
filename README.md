# node-facebook-import

Import facebook logs into a database.

Main project : [Instant Messaging Logs Base](https://github.com/rom1504/imlb) : store and make available all your instant messages

## Installation

`npm install`

## Usage

* getInbox.js retrieve the conversation list
* getConversation.js retrieve all the message of a conversation

The result currently get saved in a json file.

## Roadmap

* add the possibility to save the messages in a database, only adding what is missing there
* add a script to import the zip archive provided by facebook into the database, useful for a quick initial import

