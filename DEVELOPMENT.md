# DEVELOPMENT

[![CircleCI](https://circleci.com/gh/LearnersGuild/curriculum.svg?style=svg&circle-token=364528d1f379d9477094729dfa2aa22fc26867bc)](https://circleci.com/gh/LearnersGuild/curriculum)

## Dev Environment Setup


Install and run Node v8.1.2


#### Setup and run [mehserve](https://github.com/timecounts/mehserve)
```
echo 3233 > ~/.mehserve/curriculum.learnersguild
mehserve run
```


#### Setup and run [IDM](https://github.com/LearnersGuild/idm/)


#### Setup and run [Echo](https://github.com/LearnersGuild/echo/)


#### Setup repo

First, fork and clone the curriculum repository.

#### Install Node Packages

```bash
npm install
```

#### Creating your `.env` file

create a `.env` file like this:

```
PORT=3233
DATABASE_URL=postgres://localhost:5432/lg-curriculum
IDM_BASE_URL=http://idm.learnersguild.dev
ECHO_BASE_URL=http://echo.learnersguild.dev
JWT_PUBLIC_KEY="SEE IDM SETUP"
LOG_SQL_QUERIES=1
```

_NOTE: you can set `DISABLE_IDM=1` to disable authentication to IDM_


#### Setup the Postgresql Database

```sh
createdb lg-curriculum
npm run db:migrate
```


#### Start the server in development mode

```sh
npm run dev
```


## Continuous Integration

https://circleci.com/gh/GuildCrafts/curriculum
