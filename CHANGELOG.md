# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-alpha.5](https://github.com/HospitalRun/hospitalrun-server/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2020-11-07)

### CI

* **nodejs:** move from node v12 lts to v14 lts

## [2.0.0-alpha.4](https://github.com/HospitalRun/hospitalrun-server/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2020-09-28)

## [2.0.0-alpha.3](https://github.com/HospitalRun/hospitalrun-server/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2020-09-01)


### Features

* add docker compose ([237c1a9](https://github.com/HospitalRun/hospitalrun-server/commit/237c1a99a125fcde565f8e31c5d6186308e9257b))

## 2.0.0-alpha.2 (2020-05-17)


### Features

* add couchcb basic routes ([6d378c3](https://github.com/HospitalRun/hospitalrun-server/commit/6d378c37919a34c5e7934471be95d6d0c36fb7e7))
* add CouchDB JavaScript context ([b999929](https://github.com/HospitalRun/hospitalrun-server/commit/b9999296c6390b01b8074ea0ed263949f896ca47)), closes [#232](https://github.com/HospitalRun/hospitalrun-server/issues/232)
* add designsRootFolder ([e8e6f6f](https://github.com/HospitalRun/hospitalrun-server/commit/e8e6f6f7459112b10d4d7b94a1dfae9d07be1a9e))
* add new scripts to package.json ([ebccf4d](https://github.com/HospitalRun/hospitalrun-server/commit/ebccf4dcb12848db27db3358ad94d3fe6b73e4a2))
* Adds Typescript Fastify CLI Application ([#154](https://github.com/HospitalRun/hospitalrun-server/issues/154)) ([74ead9f](https://github.com/HospitalRun/hospitalrun-server/commit/74ead9f76c7011ab3a894838e04e9a7735250866))
* even better error handling on ddoc bin ([82333be](https://github.com/HospitalRun/hospitalrun-server/commit/82333be7ecdfeb9fa3d354bca580758c2bd58d4f))
* implement cli for generate couchdb's design documents ([9c7e36c](https://github.com/HospitalRun/hospitalrun-server/commit/9c7e36c87bfbe8bdd727a513508accc89576fd0f))
* implement design documents context namespace ([1450b4d](https://github.com/HospitalRun/hospitalrun-server/commit/1450b4df8000b4de1be5c81bbe371cf0d4254e47))
* **toolchain:** adds new commit script ([285b367](https://github.com/HospitalRun/hospitalrun-server/commit/285b3670461ed9f7667389b288eac91025c19463))
* **toolchain:** adds vscode settings folder in order to enable eslint ([683e16b](https://github.com/HospitalRun/hospitalrun-server/commit/683e16b563a055e3a896aba4f58629d9d1c2fa44))


### Bug Fixes

* **eslintrc:** remove createDefaultProgram ([8c826d9](https://github.com/HospitalRun/hospitalrun-server/commit/8c826d9df07010a76b7e60991e19460484658f5e))
* add @types/glob to devDependencies ([6c640d8](https://github.com/HospitalRun/hospitalrun-server/commit/6c640d81a2ca67ddd16cc2154cb025f49fa4ffe7))
* add autocrlf also to npm pipeline ([8015eae](https://github.com/HospitalRun/hospitalrun-server/commit/8015eaec9bd57312be192afaaf293a10ddfb6f27))
* add better error handling on ddoc bin ([6fa252a](https://github.com/HospitalRun/hospitalrun-server/commit/6fa252ad4d843d610a610a88090fed2fb655a2e5))
* add missing tsconfig option ([a13ce57](https://github.com/HospitalRun/hospitalrun-server/commit/a13ce57bf4f995811ac918043063b1947f7eb158))
* add prettier eol to the config ([b37a436](https://github.com/HospitalRun/hospitalrun-server/commit/b37a436f0ce2440b9c21ede7e5c8e5c7ee0d9deb))
* adds .npmrc ([cbc815b](https://github.com/HospitalRun/hospitalrun-server/commit/cbc815be9aa0c879075f02eb70724ef5943eb346))
* fix ddoc build command on empty src folder ([ef09ae3](https://github.com/HospitalRun/hospitalrun-server/commit/ef09ae3dbf9b4b2dc2065ce2ede56abb12c5f2a3))
* fix pre-commit hooks ([1b003d6](https://github.com/HospitalRun/hospitalrun-server/commit/1b003d6de444c502400e8df104c5e0a8156119cb))
* fix test environment ([00868f9](https://github.com/HospitalRun/hospitalrun-server/commit/00868f95e96e35994f3595aaa966490986a69548))
* fixes windows? ([de81758](https://github.com/HospitalRun/hospitalrun-server/commit/de81758f53e52f075adc93fcc995383855c9a63f))
* move autocrlf as first step on github action ci ([68df984](https://github.com/HospitalRun/hospitalrun-server/commit/68df9842d9088471623b5971cd5a872abfaadf7d))
* package.json & .snyk to reduce vulnerabilities ([#24](https://github.com/HospitalRun/hospitalrun-server/issues/24)) ([3e03601](https://github.com/HospitalRun/hospitalrun-server/commit/3e0360164e678ecdcee6e7cc189922eb59cae3d7))
* package.json & .snyk to reduce vulnerabilities ([#25](https://github.com/HospitalRun/hospitalrun-server/issues/25)) ([08b4887](https://github.com/HospitalRun/hospitalrun-server/commit/08b4887fc6a7c573a3194a41bbe876f9a68b8eb5))
* package.json & .snyk to reduce vulnerabilities ([#26](https://github.com/HospitalRun/hospitalrun-server/issues/26)) ([07df5ed](https://github.com/HospitalRun/hospitalrun-server/commit/07df5edfd4f24652c970d21e55e778bc47b8eb5b))
* package.json & .snyk to reduce vulnerabilities ([#27](https://github.com/HospitalRun/hospitalrun-server/issues/27)) ([f952e80](https://github.com/HospitalRun/hospitalrun-server/commit/f952e8011f162310577da9a01fcfbd10e473a20e))
* prevent modifying lf to crlf on checkout on windows ([f297723](https://github.com/HospitalRun/hospitalrun-server/commit/f297723214980a711cb0b08efd97861ffa58c9c8))
* remove unnecessary file creation from ddoc ([d6c8e4a](https://github.com/HospitalRun/hospitalrun-server/commit/d6c8e4a957eab2fe4b26c5235e779355ceb933ba))
* remove yarn storybook github workflow command ([b1ae9b4](https://github.com/HospitalRun/hospitalrun-server/commit/b1ae9b4ede7c9a48486d364e4afbf1bbe61eaf66))
* rename unused parameters to accomodate new tsconfig.json settings ([41aaa22](https://github.com/HospitalRun/hospitalrun-server/commit/41aaa22cbe7be5d64ede2a70168a1f2490f2311e))
* replace test:ci with test script on yarn ci ([251f4c7](https://github.com/HospitalRun/hospitalrun-server/commit/251f4c79dce164c7f888563ed194d7d9d77d5601))
* update nano to fix issue with types and CD/CI build ([85a5034](https://github.com/HospitalRun/hospitalrun-server/commit/85a503478e65a4e93f64541efd2f888c7424106f))
* **deps:** moves fastify-plugin to deps from devDeps ([8e5b35c](https://github.com/HospitalRun/hospitalrun-server/commit/8e5b35c84d4d13378d5631b2810830f17298e25f))
* **fastify:** fixes fastify app loading ([c4c1bcb](https://github.com/HospitalRun/hospitalrun-server/commit/c4c1bcb9ce288f0a366b2548d159a9c04601dae0))
* **fastify-autoload:** fixes export default fastify-autoload bug ([646a59e](https://github.com/HospitalRun/hospitalrun-server/commit/646a59eb035500447cc89627c5049dd6aaad122b)), closes [#236](https://github.com/HospitalRun/hospitalrun-server/issues/236)
* **license:** reverts license to MIT on the next version ([fe3ecae](https://github.com/HospitalRun/hospitalrun-server/commit/fe3ecae61a657adc61417bf7a62c712a261829ff))
* **package:** update csv-parse to version 1.2.1 ([e9f2534](https://github.com/HospitalRun/hospitalrun-server/commit/e9f25348688f0b9bd5a95028e12bc986c425e9a3))
* **package:** update csv-parse to version 1.3.0 ([ab42b30](https://github.com/HospitalRun/hospitalrun-server/commit/ab42b30369d5c659b5c765ad61b661492f243bae))
* **package:** update csv-parse to version 2.0.2 ([df99aba](https://github.com/HospitalRun/hospitalrun-server/commit/df99abaa907620d111a619e86994685726f49329))
* **package:** update csv-parse to version 2.2.0 ([3733369](https://github.com/HospitalRun/hospitalrun-server/commit/37333691d7916b03bc4c0c6ae11c431c74e06910))
* **package:** update csv-stringify to version 2.0.0 ([2a112aa](https://github.com/HospitalRun/hospitalrun-server/commit/2a112aae491aa57871da0c446f84e49e5402b502))
* **package:** update csv-stringify to version 3.0.0 ([1f74470](https://github.com/HospitalRun/hospitalrun-server/commit/1f74470c40cb31dbe9d887ffc4cefb13c2f0bc41))
* **package:** update hospitalrun to version 0.9.17 ([#31](https://github.com/HospitalRun/hospitalrun-server/issues/31)) ([f9cbb57](https://github.com/HospitalRun/hospitalrun-server/commit/f9cbb57359b078146276c0afd66426cea113b5e9))
* **package:** update hospitalrun-dblisteners to version 0.9.6 ([#35](https://github.com/HospitalRun/hospitalrun-server/issues/35)) ([b898a69](https://github.com/HospitalRun/hospitalrun-server/commit/b898a690f80e7e434e609d48f9716a7c9a845784))
* **package:** update hospitalrun-dblisteners to version 1.0.1 ([f79ccea](https://github.com/HospitalRun/hospitalrun-server/commit/f79cceae7b510ef09220a27ab6cad7b2383d8390))
* **package:** update hospitalrun-server-routes to version 0.9.10 ([#34](https://github.com/HospitalRun/hospitalrun-server/issues/34)) ([c8b5b01](https://github.com/HospitalRun/hospitalrun-server/commit/c8b5b01c8589d393555c8f2242c3f853b92301a7))
* **package:** update hospitalrun-server-routes to version 0.9.11 ([#40](https://github.com/HospitalRun/hospitalrun-server/issues/40)) ([ca9a2d4](https://github.com/HospitalRun/hospitalrun-server/commit/ca9a2d45d12bcc3a2d274577a4006fa68642a541))
* **package:** update osprey to version 0.5.0 ([dad2014](https://github.com/HospitalRun/hospitalrun-server/commit/dad20142aea10c754a892b56447dfa5f8be8ee10))

## 2.0.0-alpha.1 (2020-02-07)


### Features

* add couchcb basic routes ([6d378c3](https://github.com/HospitalRun/hospitalrun-server/commit/6d378c37919a34c5e7934471be95d6d0c36fb7e7))
* add new scripts to package.json ([ebccf4d](https://github.com/HospitalRun/hospitalrun-server/commit/ebccf4dcb12848db27db3358ad94d3fe6b73e4a2))
* **toolchain:** adds new commit script ([285b367](https://github.com/HospitalRun/hospitalrun-server/commit/285b3670461ed9f7667389b288eac91025c19463))
* **toolchain:** adds vscode settings folder in order to enable eslint ([683e16b](https://github.com/HospitalRun/hospitalrun-server/commit/683e16b563a055e3a896aba4f58629d9d1c2fa44))
* Adds Typescript Fastify CLI Application ([#154](https://github.com/HospitalRun/hospitalrun-server/issues/154)) ([74ead9f](https://github.com/HospitalRun/hospitalrun-server/commit/74ead9f76c7011ab3a894838e04e9a7735250866))


### Bug Fixes

* fix pre-commit hooks ([1b003d6](https://github.com/HospitalRun/hospitalrun-server/commit/1b003d6de444c502400e8df104c5e0a8156119cb))
* fix test environment ([00868f9](https://github.com/HospitalRun/hospitalrun-server/commit/00868f95e96e35994f3595aaa966490986a69548))
* rename unused parameters to accomodate new tsconfig.json settings ([41aaa22](https://github.com/HospitalRun/hospitalrun-server/commit/41aaa22cbe7be5d64ede2a70168a1f2490f2311e))
* **deps:** moves fastify-plugin to deps from devDeps ([8e5b35c](https://github.com/HospitalRun/hospitalrun-server/commit/8e5b35c84d4d13378d5631b2810830f17298e25f))
* **fastify:** fixes fastify app loading ([c4c1bcb](https://github.com/HospitalRun/hospitalrun-server/commit/c4c1bcb9ce288f0a366b2548d159a9c04601dae0))
* **license:** reverts license to MIT on the next version ([fe3ecae](https://github.com/HospitalRun/hospitalrun-server/commit/fe3ecae61a657adc61417bf7a62c712a261829ff))
* adds .npmrc ([cbc815b](https://github.com/HospitalRun/hospitalrun-server/commit/cbc815be9aa0c879075f02eb70724ef5943eb346))
* **package:** update csv-parse to version 1.2.1 ([e9f2534](https://github.com/HospitalRun/hospitalrun-server/commit/e9f25348688f0b9bd5a95028e12bc986c425e9a3))
* **package:** update csv-parse to version 1.3.0 ([ab42b30](https://github.com/HospitalRun/hospitalrun-server/commit/ab42b30369d5c659b5c765ad61b661492f243bae))
* **package:** update csv-parse to version 2.0.2 ([df99aba](https://github.com/HospitalRun/hospitalrun-server/commit/df99abaa907620d111a619e86994685726f49329))
* **package:** update csv-parse to version 2.2.0 ([3733369](https://github.com/HospitalRun/hospitalrun-server/commit/37333691d7916b03bc4c0c6ae11c431c74e06910))
* **package:** update csv-stringify to version 2.0.0 ([2a112aa](https://github.com/HospitalRun/hospitalrun-server/commit/2a112aae491aa57871da0c446f84e49e5402b502))
* **package:** update csv-stringify to version 3.0.0 ([1f74470](https://github.com/HospitalRun/hospitalrun-server/commit/1f74470c40cb31dbe9d887ffc4cefb13c2f0bc41))
* **package:** update hospitalrun to version 0.9.17 ([#31](https://github.com/HospitalRun/hospitalrun-server/issues/31)) ([f9cbb57](https://github.com/HospitalRun/hospitalrun-server/commit/f9cbb57359b078146276c0afd66426cea113b5e9))
* **package:** update hospitalrun-dblisteners to version 0.9.6 ([#35](https://github.com/HospitalRun/hospitalrun-server/issues/35)) ([b898a69](https://github.com/HospitalRun/hospitalrun-server/commit/b898a690f80e7e434e609d48f9716a7c9a845784))
* **package:** update hospitalrun-dblisteners to version 1.0.1 ([f79ccea](https://github.com/HospitalRun/hospitalrun-server/commit/f79cceae7b510ef09220a27ab6cad7b2383d8390))
* **package:** update hospitalrun-server-routes to version 0.9.10 ([#34](https://github.com/HospitalRun/hospitalrun-server/issues/34)) ([c8b5b01](https://github.com/HospitalRun/hospitalrun-server/commit/c8b5b01c8589d393555c8f2242c3f853b92301a7))
* **package:** update hospitalrun-server-routes to version 0.9.11 ([#40](https://github.com/HospitalRun/hospitalrun-server/issues/40)) ([ca9a2d4](https://github.com/HospitalRun/hospitalrun-server/commit/ca9a2d45d12bcc3a2d274577a4006fa68642a541))
* **package:** update osprey to version 0.5.0 ([dad2014](https://github.com/HospitalRun/hospitalrun-server/commit/dad20142aea10c754a892b56447dfa5f8be8ee10))
* package.json & .snyk to reduce vulnerabilities ([#24](https://github.com/HospitalRun/hospitalrun-server/issues/24)) ([3e03601](https://github.com/HospitalRun/hospitalrun-server/commit/3e0360164e678ecdcee6e7cc189922eb59cae3d7))
* package.json & .snyk to reduce vulnerabilities ([#25](https://github.com/HospitalRun/hospitalrun-server/issues/25)) ([08b4887](https://github.com/HospitalRun/hospitalrun-server/commit/08b4887fc6a7c573a3194a41bbe876f9a68b8eb5))
* package.json & .snyk to reduce vulnerabilities ([#26](https://github.com/HospitalRun/hospitalrun-server/issues/26)) ([07df5ed](https://github.com/HospitalRun/hospitalrun-server/commit/07df5edfd4f24652c970d21e55e778bc47b8eb5b))
* package.json & .snyk to reduce vulnerabilities ([#27](https://github.com/HospitalRun/hospitalrun-server/issues/27)) ([f952e80](https://github.com/HospitalRun/hospitalrun-server/commit/f952e8011f162310577da9a01fcfbd10e473a20e))

# [1.1.0](https://github.com/HospitalRun/hospitalrun-server/compare/v1.0.0...v1.1.0) (2019-10-20)


### Bug Fixes

* **deps:** moves fastify-plugin to deps from devDeps ([8e5b35c](https://github.com/HospitalRun/hospitalrun-server/commit/8e5b35c84d4d13378d5631b2810830f17298e25f))
* **fastify:** fixes fastify app loading ([c4c1bcb](https://github.com/HospitalRun/hospitalrun-server/commit/c4c1bcb9ce288f0a366b2548d159a9c04601dae0))
* **license:** reverts license to MIT on the next version ([fe3ecae](https://github.com/HospitalRun/hospitalrun-server/commit/fe3ecae61a657adc61417bf7a62c712a261829ff))
* **package:** update csv-parse to version 1.2.1 ([e9f2534](https://github.com/HospitalRun/hospitalrun-server/commit/e9f25348688f0b9bd5a95028e12bc986c425e9a3))
* **package:** update csv-parse to version 1.3.0 ([ab42b30](https://github.com/HospitalRun/hospitalrun-server/commit/ab42b30369d5c659b5c765ad61b661492f243bae))
* **package:** update csv-parse to version 2.0.2 ([df99aba](https://github.com/HospitalRun/hospitalrun-server/commit/df99abaa907620d111a619e86994685726f49329))
* adds .npmrc ([cbc815b](https://github.com/HospitalRun/hospitalrun-server/commit/cbc815be9aa0c879075f02eb70724ef5943eb346))
* **package:** update csv-parse to version 2.2.0 ([3733369](https://github.com/HospitalRun/hospitalrun-server/commit/37333691d7916b03bc4c0c6ae11c431c74e06910))
* **package:** update csv-stringify to version 2.0.0 ([2a112aa](https://github.com/HospitalRun/hospitalrun-server/commit/2a112aae491aa57871da0c446f84e49e5402b502))
* **package:** update csv-stringify to version 3.0.0 ([1f74470](https://github.com/HospitalRun/hospitalrun-server/commit/1f74470c40cb31dbe9d887ffc4cefb13c2f0bc41))
* **package:** update hospitalrun-dblisteners to version 1.0.1 ([f79ccea](https://github.com/HospitalRun/hospitalrun-server/commit/f79cceae7b510ef09220a27ab6cad7b2383d8390))
* **package:** update osprey to version 0.5.0 ([dad2014](https://github.com/HospitalRun/hospitalrun-server/commit/dad20142aea10c754a892b56447dfa5f8be8ee10))


### Features

* Adds Typescript Fastify CLI Application ([#154](https://github.com/HospitalRun/hospitalrun-server/issues/154)) ([74ead9f](https://github.com/HospitalRun/hospitalrun-server/commit/74ead9f76c7011ab3a894838e04e9a7735250866))
* **toolchain:** adds new commit script ([285b367](https://github.com/HospitalRun/hospitalrun-server/commit/285b3670461ed9f7667389b288eac91025c19463))
* **toolchain:** adds vscode settings folder in order to enable eslint ([683e16b](https://github.com/HospitalRun/hospitalrun-server/commit/683e16b563a055e3a896aba4f58629d9d1c2fa44))
