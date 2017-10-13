/************************************************************************** Readme **************************************************************************/
/*
概述:
gulp是前端工程构建解决方案,虽然是已经过时的技术,但是非常适合当前项目.
gulpfile.js 放在项目根目录下,运行gulp命令,将自动运行该脚本
该脚本使用的gulp功能有
1.自动批量压缩js 和 css文件
2.自动批量给js 和css 等静态文件添加md5版本号
3.自动批量替换html中的url
后续还可以添加图片压缩,语法校验等功能

安装:
1.运行如下命令安装gulp以及该脚本所用到的gulp插件(如果没有安装node,请自行安装node)
npm install gulp gulp-clean gulp-rename gulp-rev gulp-rev-collector gulp-csso gulp-uglify gulp-replace path -g; //-g表示安装到全局环境，默认为/usr/local/lib/node_modules/

2.将刚刚安装好的插件链接到开发目录
npm link gulp gulp-clean gulp-rename gulp-rev gulp-rev-collector gulp-csso gulp-uglify gulp-replace path;

运行:

在开发目录下运行 gulp命令即可


*/
/**************************************************************************   end  **************************************************************************/
//必要配置
var projectConfig = {
  dirs: {
    src_css_dir: ['public/css/common/css'],
    src_js_dir: ['public/js/common/js', 'public/js/third-common/js/**'],
    src_html_dir: ['application/views'],
    src_img_dir: ['public/images/'],

    dist_css_dir: 'public/dist/css',
    dist_js_dir: 'public/dist/js',
    dist_html_dir: 'application/views',
    dist_img_dir: 'public/images/',
  },
  replace: {
    css: {
      '/dist/dist/dist/dist/css/third/': '/dist/css/third/',
      '/dist/dist/dist/dist/css/': '/dist/css/',
      '/css/': '/dist/css/'
    },
    js: {
      '/dist/dist/dist/dist/js/third/': '/dist/js/third/',
      '/dist/dist/dist/dist/js/': '/dist/js/',
      '/js/': '/dist/js/'
    }
  }
}

/**************************************************************************   end  **************************************************************************/



var gulp = require('gulp'); //引入基础库

csso          = require('gulp-csso'); //css压缩工具
// jshint        = require('gulp-jshint'); //js语法检查工具
uglify        = require('gulp-uglify'); //js压缩工具
//concat        = require('gulp-concat'); //文件合并工具
clean         = require('gulp-clean'); //文件清理工具
rename        = require('gulp-rename'); //文件重命名工具
rev           = require('gulp-rev'); //更改版本名
revCollector  = require('gulp-rev-collector'); //更改html资源url工具
replace       = require('gulp-replace'); //url替换
path          = require('path');
//merge         = require('merge-stream');
//gulplog       = require('gulplog');

//清理构建目标目录中的文件
gulp.task('clean', function(){
  var cleanDirs = [];
  cleanDirs.push(projectConfig.dirs.dist_css_dir);
  cleanDirs.push(projectConfig.dirs.dist_js_dir);
  return gulp.src(cleanDirs, {read:false}).pipe(clean());
});

//css优化
gulp.task('cssmin', ["clean"], function(){
  var cssDirs = [];
  projectConfig.dirs.src_css_dir.map(function(dir){
    cssDirs.push(dir+'/*.css');
  });
  return gulp.src(cssDirs)
        .pipe(csso())
        .pipe(rename(function(path){
            path.extname = '.css';
        }))
        .pipe(rev())
        .pipe(gulp.dest(projectConfig.dirs.dist_css_dir))
        .pipe(rev.manifest())
        .pipe(gulp.dest(projectConfig.dirs.dist_css_dir));
});

//js优化
gulp.task('jsmin', ["cssmin"], function(){
  var jsDirs = [];
  projectConfig.dirs.src_js_dir.map(function(dir){
    jsDirs.push(dir+'/*.js');
  });
  return gulp.src(jsDirs)
        .pipe(uglify())
        .pipe(rename(function(path){
            path.extname = '.js';
        }))
        .pipe(rev())
        .pipe(gulp.dest(projectConfig.dirs.dist_js_dir))
        .pipe(rev.manifest())
        .pipe(gulp.dest(projectConfig.dirs.dist_js_dir));
});


//模板css文件名称替换
gulp.task('revcss', ["cssmin"], function(){
      var htmlDirs = [];
      projectConfig.dirs.src_html_dir.map(function(dir){
        htmlDirs.push(dir+'/**/*.tpl');
      });
      htmlDirs.push(projectConfig.dirs.dist_css_dir+'/*.json');
      return gulp.src(htmlDirs)
                    .pipe(revCollector({
                      replaceReved: true
                    }))
                    .pipe(gulp.dest(projectConfig.dirs.dist_html_dir));
});

//模板js文件名称替换
gulp.task('revjs', ["revcss"], function(){
      var htmlDirs = [];
      projectConfig.dirs.src_html_dir.map(function(dir){
        htmlDirs.push(dir+'/**/*.tpl');
      });
      htmlDirs.push(projectConfig.dirs.dist_js_dir+'/*.json');
      return gulp.src(htmlDirs)
                    .pipe(revCollector({
                      replaceReved: true
                    }))
                    .pipe(gulp.dest(projectConfig.dirs.dist_html_dir));
});

gulp.task('replace', ["revjs"], function(){
    var htmlDirs = [];
    projectConfig.dirs.src_html_dir.map(function(dir){
      htmlDirs.push(dir+'/**/*.tpl');
    });
    gulp.src(htmlDirs)
    .pipe(replace(/['"]([^"']+\.(js|css).*?)(\?.*?)?["']/img, function(m, p1) {
      var pathinfo = path.parse(p1);

      if (pathinfo.ext == '.js') {
        for (var key in projectConfig.replace.js) {
          //如果当前路径已经等于 发布路径,则不处理
          if (projectConfig.replace.js[key] == pathinfo.dir+'/') {
            return m;
          }
        }
        //检查当前路径是否==指定replace规则key,如果符合直接替换成对应的发布路径
        if (projectConfig.replace.js[pathinfo.dir+'/']) {
          return '"'+projectConfig.replace.js[pathinfo.dir+'/']+pathinfo.name+'.js"';
        }
        return m;
      } else if (pathinfo.ext == '.css') {
        for (var key in projectConfig.replace.css) {
          //如果当前路径已经等于 发布路径,则不处理
          if (projectConfig.replace.css[key] == pathinfo.dir+'/') {
            return m;
          }
        }
        //检查当前路径是否==指定replace规则key,如果符合直接替换成对应的发布路径
        if (projectConfig.replace.css[pathinfo.dir+'/']) {
          return '"'+projectConfig.replace.css[pathinfo.dir+'/']+pathinfo.name+'.css"';
        }
        return m;
      } else {
        return m;
      }
    }))
    .pipe(gulp.dest(projectConfig.dirs.dist_html_dir));
});

gulp.task('default', ["clean", "jsmin", "cssmin", "revcss", "revjs", "replace"]);
