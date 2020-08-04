# HospitalRun Server

<div align="center">

![Status](https://img.shields.io/badge/Status-developing-brightgree) [![Release](https://img.shields.io/github/release/HospitalRun/hospitalrun-server.svg)](https://github.com/HospitalRun/hospitalrun-server/releases) [![Version](https://img.shields.io/github/package-json/v/hospitalrun/hospitalrun-server)](https://github.com/HospitalRun/hospitalrun-server/releases) [![GitHub CI](https://github.com/HospitalRun/server/workflows/GitHub%20CI/badge.svg)](https://github.com/HospitalRun/server/actions) [![Coverage Status](https://coveralls.io/repos/github/HospitalRun/hospitalrun-server/badge.svg?branch=master)](https://coveralls.io/github/HospitalRun/hospitalrun-server?branch=master) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/HospitalRun/hospitalrun-server.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/HospitalRun/hospitalrun-server/context:javascript) ![Code scanning](https://github.com/HospitalRun/hospitalrun-server/workflows/Code%20scanning/badge.svg?branch=master) [![Documentation Status](https://readthedocs.org/projects/hospitalrun-server/badge/?version=latest)](https://hospitalrun-server.readthedocs.io)
 [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FHospitalRun%2Fhospitalrun-server.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FHospitalRun%2Fhospitalrun-server?ref=badge_shield) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) ![dependabot](https://api.dependabot.com/badges/status?host=github&repo=HospitalRun/hospitalrun-server) [![Slack](https://hospitalrun-slack.herokuapp.com/badge.svg)](https://hospitalrun-slack.herokuapp.com)

</div>

Node.js backend for [HospitalRun](http://hospitalrun.io/): free software for developing world hospitals. To contribute, follow the guidelines in this readme or alternatively ask for details on the community Slack channel: [#contributors](https://hospitalrun-slack.herokuapp.com).

---

**This repository is for the HospitalRun v2 and it is currently under heavy development. If you are searching for the no longer supported version 1.0.0-beta, you can find it [here](https://github.com/HospitalRun/hospitalrun-server/tree/1.0.0-beta).**

# Contributing

Contributions are always welcome. Before contributing please read our [contributor guide](https://github.com/HospitalRun/hospitalrun-server/blob/master/.github/CONTRIBUTING.md). Then follow these steps:

1. [Fork](https://github.com/HospitalRun/hospitalrun-server/fork) this repository to your own GitHub account
2. Clone it to your local machine
3. Navigate to the cloned folder: `cd hospitalrun-server`
4. Install the dependencies: `npm install`
5. [Install and Run CouchDB](#development-database)
6. Check that [env variables](https://github.com/HospitalRun/hospitalrun-server#environment) are set correctly 
6. Run `npm run dev`  to build and watch for code changes:
   - a development database will start on http://localhost:5984
   - you can access its Admin interface on http://localhost:5984/_utils, `username: dev` and `password: dev`

## Working on Issues
In order to optimize the workflow and to prevent multiple contributors working on the same issue without interactions, a contributor must ask to be assigned to an issue by one of the core team members: it's enough to ask it inside the specific issue.

## Environment
In order to run `hospitalrun-server`  you need to set the correct environment variables. Since [dotenv](https://www.npmjs.com/package/dotenv) is already included, it is just matter of renaming `.env.example` file to `.env`: this file include all of the mandatory defaults.

## Development Database
There are different ways to install CouchDB.
- Install CouchDB [directly](https://docs.couchdb.org/en/stable/install/index.html)
- Install and run via [Docker](https://hub.docker.com/_/couchdb)

## Tests
Every code additions or fixs on the existing code, has to be tested. This project uses [node-tap](https://node-tap.org/) as test runner. To run all tests use `npm run test`.

## How to commit

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). [Commitizen](https://github.com/commitizen/cz-cli) is mandatory for making proper commits. Once you have staged your changes, can run `npm run commit` from the root directory in order to commit following our standards.

# Documentation
## DataBase
Read more at <a href="https://github.com/HospitalRun/hospitalrun-server/blob/master/docs/database.md"><code><b>HospitalRun DataBase</b></code></a>.

## Plugins
Read more at <a href="https://github.com/HospitalRun/hospitalrun-server/blob/master/docs/plugins.md"><code><b>HospitalRun Plugins</b></code></a>.

## Services
Read more at <a href="https://github.com/HospitalRun/hospitalrun-server/blob/master/docs/services.md"><code><b>HospitalRun Services</b></code></a>.

# License

Released under the [MIT license](LICENSE).
