# How to build a web app using npm and gulp
- This is a sample project for build a static web site using npm (yarn, if you need) and gulp.
- Fallow this steps to build your web application.
- In here, some of task describe with points

## Step -1 Create a project
- First create a project using npm
```shell
npm init
```
- If you need to create the project using yarn, first install yarn
```shell
npm install -g yarn
```
- Then,
```shell
yarn init
```
- After that you have to fill this section with information like this.
![project-build](doc/img/project-build.png)
- If done, press enter.

## Add, Updating and Removing packages
- In here shows an example of each and every command with gulp
### Add Package
- npm:
```shell
npm install [package-name]
```
```shell
npm install gulp
```

- yarn:
```shell
yarn add [package-name]
```
```shell
yarn add gulp
```

#### - Add Package with version
- npm:
```shell
npm install [package-name]@[version-or-tag]
```
```shell
npm install gulp@4.0
```

- yarn:
```shell
yarn add [package-name]@[version-or-tag]
```
```shell
yarn add gulp@4.0
```
#### - If you need to check version of the package,
- npm:
```shell
npm install [package-name]@^
```
```shell
npm update gulp@^
```

- yarn:
```shell
yarn add [package-name]@^
```
```shell
yarn add gulp@^
```
### Upgrade the package
- npm:
```shell
npm update [scope] [package-name]
```
```shell
npm update -g gulp
```

- yarn:
```shell
yarn upgrade [package-name]@[version-to-update]
```
```shell
yarn upgrade gulp@4.0
```
### Delete the package
- npm:
```shell
npm uninstall [scope] [package-name]@[version-if-have]
```
```shell
npm uninstall -g gulp@4.0
```

- yarn:
```shell
yarn remove [package-name]@[version-if-have]
```
```shell
yarn remove gulp@4.0
```

## Dependencies
- There are three types of dependencies.
    - dev
    - peer
    - optional
- Mainly we using dev dependency as well.
- For our final output, If we no need some of packages such as, gulp, gulp-sass etc. save in the dev dependency. So we use this command for that.
- Refer Step - 2 Install Gulp for the example
- npm:
```shell
npm install [package-name] --save-dev
```
```shell
npm install [package-name]@[version-or-tag]  --save-dev
```

- yarn:
```shell
yarn add [package-name] --dev
```
```shell
yarn add [package-name]@[version-or-tag] --dev
```

## Step - 2 Install Gulp
- npm:
```shell
npm install gulp --save-dev
```

- yarn:
```shell
yarn add gulp --dev
```
