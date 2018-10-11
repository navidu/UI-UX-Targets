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
    - --dev
    - --peer
    - --optional
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
- After this, gulp folder install in to the package under node_module folder.

## Step - 3 Determining Folder Structure
- Create your folder structure like this

```puml
    |-sample-app
      |- src/
          |- scss/
            |-partials
            |-style.scss
          |- fonts/
          |- img/
          |- html/
            |-partials
            |-index.html
          |- js/
      |- gulpfile.js
      |- node_modules/
      |- package.json
```
- src: This is the source folder of application. All the source file for build the application is in this folder.
- gulpfile.js: All gulp task is in this java script
- node_modules: All packages in this folder
- package.json: All dependency for build node_modules are in this json

## Create gulpfile.js file
### Write my first gulp task
```JavaScript
var gulp = require('gulp'); //variable
```
- The require statement tells Node to look into the `node_modules` folder for a package named `gulp`. Once the package is found, we assign its contents to the variable `gulp`
```JavaScript
//function for build the tasks
gulp.task('task-name', function() {
  // Stuff here
});
```

- `task-name` refers to the name of the task, which would be used whenever you want to run a task in Gulp. You can also run the same task in the command line by writing `gulp task-name`.

```JavaScript
gulp.task('hello', function() {
  console.log('Hello Navidu');
});
```

- Your out come will be like this:
![project-build](doc/img/hello-navidu.png)

```JavaScript
gulp.task('task-name', function () {
  return gulp.src('source-files') // Get source files with gulp.src
    .pipe(aGulpPlugin()) // Sends it through a gulp plugin
    .pipe(gulp.dest('destination')) // Outputs the file in the destination folder
})
```

- As you can see, a real task takes in two additional gulp methods — `gulp.src` and `gulp.dest`.
- `gulp.src` tells the Gulp task what files to use for the task, while `gulp.dest` tells Gulp where to output the files once the task is completed.

## Step - 4 Write a task for SCSS

- Install sass using npm:
```shell
npm install gulp-sass --save-dev
```

```JavaScript
var sass = require('gulp-sass'); //requires the gulp-sass plugin

gulp.task('scss', function(){
    return gulp.src('src/scss/**/*.scss') // refer "Globbing in Node" title
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
});
```
- Run scss task using `gulp scss`
- You have a new folder call dist and under that folder have css folder with style.css
- Now you have new folder call dist and your file order will be like this

```puml
    |-sample-app
      |- dist/
          |- css/
            |-style.css
      |- src/
          |- scss/
            |-partials
            |-style.scss
          |- fonts/
          |- img/
          |- html/
            |-partials
            |-index.html
          |- js/
      |- gulpfile.js
      |- node_modules/
      |- package.json
```

## Globbing in Node
- `*.scss` : any file match ending with `.scss`
-  `**/*.scss` : any file match ending with `.scss` in the root folder
- `!not-me.scss` : not execute
-  `*.+(scss|sass)` : multiple pattern from root folder (`.scss` files or `.sass` files)

## Step - 5 Watching changeable files changes
- Write a function for watch task. It go and check every changeable files such as custom JavaScripts, SCSS and HTML file changes and update.
```JavaScript
gulp.task('watch', function(){
    gulp.watch('src/scss/**/*.scss', ['scss']);
});
```