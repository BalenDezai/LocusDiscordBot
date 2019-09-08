<h1 align="center">
  <br>
  LocusBot
  <br>
</h1>

<p align="center">
  <a href="#about">About</a> •
  <a href="#install">Install</a> •
  <a href="#usage">Usage</a>
</p>

<h1 align="center" id="#about">About</h1>

A discord bot made for use and fun by @BalenD and @Bravio

<h1 align="center" id="#install">Install</h1>

Installing the bot is very simple. Simply run the command

```bash
# install
$ git clone https://github.com/BalenD/LocusDiscordBot.git
```

Then install the packages using npm

```bash
# install the packages
$ npm i
```

## NOTE
Installation of the modules might fail in a windows environment due to "nodegyp-rebuild".

If you do come across such errors, make sure to try out these steps:

```powershell
# install the node.js windows toolset (make sure CMD or powershell is open as administrator)
$ npm i --global windows-build-tools
```
If it still does not work,

1. Make sure you have python 2.7 installed
2. Make sure you have VC++ 2017 or 2015 toolset installed
3. Make sure node.js uses python 2.7 and not 3+
```bash
# set node.js python version
$ npm config set python python2.7
```
4. set msvs version to 2017 (or 2015)
```bash
# set node.js python version
$ npm config set msvs_version 2017
```
5. try installing the modules again

<h1 align="center" id="#usage">Usage</h1>

1. Create config.js
2. Copy contents of config.example.js into config.js
3. Insert token in the token area
```js
const config = {
  botAdmins: [''],
  token: '{token area}',
}
```

4. run npm start script
```bash
# start the bot
$ npm start
```