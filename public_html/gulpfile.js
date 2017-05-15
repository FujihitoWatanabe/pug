//gulpfile.js

/*-------------------- インストールコマンド --------------------- */
//グローバル
    // npm i -g gulp
//以下はプロジェクトフォルダで入力
    // npm i -D gulp
    // npm i -D gulp-autoprefixer
    // npm i -D gulp-minify-css
    // npm i -D gulp-uglify
    // npm i -D gulp gulp-sass gulp-postcss postcss-cssnext
    // npm i -D browser-sync
    // npm i -D gulp-debug
    // npm i -D gulp-plumber
    // npm i -D gulp-notify
    // npm i -D gulp-imagemin
    // npm i -D gulp-ejs
    // npm i -D gulp-minify-ejs
    // npm i -D gulp-rename
    // npm i -D gulp-pug
    // npm i -D gulp-data
/*-------------------- /インストールコマンド -------------------- */

/*-------------------- plug-in -------------------------------- */
var gulp = require("gulp");
//var autoprefixer = require("gulp-autoprefixer");
var minifycss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var sass = require('gulp-sass');
var postcss = require("gulp-postcss");
var cssnext = require("postcss-cssnext");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
//var debug = require("gulp-debug");
//var plumber = require("gulp-plumber");
//var notify  = require("gulp-notify");
var imagemin = require("gulp-imagemin");
//var ejs = require("gulp-ejs");
var pug = require("gulp-pug");
var fs = require("fs");
var data = require("gulp-data");
//var path = require("path");
//var minifyejs = require("gulp-minify-ejs");
//var rename = require("gulp-rename");
/*-------------------- plug-in --------------------------------- */

/*-------------------- タスク ---------------------------------- */
//ベンダープレフィックス
/*
gulp.task("autoprefixer", function () {
    return gulp.src("*.css")
    .pipe(autoprefixer({
        //IEは9以上、Androidは4以上、iOS Safariは8以上
        //その他は最新2バージョンで必要なベンダープレフィックスを付与する
        browsers: ["last 2 versions", "ie >= 9", "Android >= 4","ios_saf >= 8"],
        cascade: false
}))
.pipe(gulp.dest("dest/css/"));
});
*/

//scssをコンパイル(圧縮、ベンダープレフィックス)
var paths = {
    "scss": "src/scss/", //作業するscssのフォルダ
    "css": "dest/css/"  //コンパイルして保存するcssのフォルダ
}
gulp.task('scss', function() {
  var processors = [
     //cssnext()
     cssnext({browsers: ["last 2 versions", "ie >= 9", "Android >= 4","ios_saf >= 8"]}) //ブラウザ/os バージョン
 ];
  return gulp.src(paths.scss + "**/*.scss")
    .pipe(postcss(processors))
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(gulp.dest(paths.css))
});

//CSS圧縮
/*
gulp.task("minify-css", function() {
    return gulp.src("*.css")
    .pipe(minifycss())
    .pipe(gulp.dest("dest/css/"))
});
*/

//画像圧縮
/*gulp.task('imagemin', function(){
    gulp.src("src/images/*.jpg")
      .pipe(imagemin())
      .pipe(gulp.dest("dest/images/"));
    gulp.src("src/images/*.png")
      .pipe(imagemin())
      .pipe(gulp.dest("dest/images/"));
});
*/
gulp.task('imagemin', function(){
  var srcGlob = 'src/images/**/*.+(jpg|jpeg|png|gif|svg)';
  var dstGlob = 'src/images/';

  var imageminOptions = {
    optimizationLevel: 7
  };
  gulp.src(srcGlob )
    .pipe(imagemin( imageminOptions ))
    .pipe(gulp.dest("dest/images/"));
});

//JS圧縮
gulp.task("uglify", function() {
    return gulp.src("src/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dest/js/"))
});

//Pug(テンプレートエンジン)
gulp.task("pug", function () {
    //var json = JSON.parse(fs.readFileSync("./pages.json"));
    gulp.src(
      ["src/pug/**/*.pug",'!' + "src/pug/**/_*.pug"] //参照するディレクトリ、出力を除外するファイル
    )
    .pipe(data( file => {
        return JSON.parse(fs.readFileSync(`./pages.json`));
    }))
    .pipe(pug({
      pretty:'    '
    }))
    .pipe(gulp.dest("dest/")) //出力先
});

//EJS(テンプレートエンジン)
//gulp.task("ejs", function() {
//    var json = JSON.parse(fs.readFileSync("./pages.json"));
//    gulp.src(
//       ["src/ejs/**/*.ejs",'!' + "src/ejs/**/_*.ejs"] //参照するディレクトリ、出力を除外するファイル
//    )
//    .pipe(ejs(json))
    //.pipe(ejs())
//    .pipe(minifyejs())　//圧縮
//    .pipe(rename({extname: ".html"})) //拡張子をhtmlに
//    .pipe(gulp.dest("dest/")) //出力先
//});

/*-------------------- /タスク ------------------------------- */

/*-------------------- リアルタイム監視------------------------ */
gulp.task("watch", function() {
    //gulp.watch(".*css", ["minify-css"]);
    //gulp.watch(".*css", ["autoprefixer"]);
    gulp.watch("src/scss/*.scss", ["scss"]);
    gulp.watch("src/js/*.js", ["uglify"]);
    //gulp.watch("src/ejs/**/*.ejs", ["ejs"]);
    gulp.watch("src/pug/**/*.pug", ["pug"]);
    browserSync.init({
        files: ["src/scss/","src/js/","src/pug/"],
        proxy: "http://localhost/~pug-dev",
        //open: "external"
    });
});
/*-------------------- /リアルタイム監視 ---------------------- */