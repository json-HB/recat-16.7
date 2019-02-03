var gulp = require("gulp");
var path = require("path");

const cssPath = [
  path.resolve(__dirname, "public/bootstrap/dist/css/bootstrap.css")
];

gulp.task("bootstrap", function() {
  gulp.src(cssPath).pipe(gulp.dest("./src/"));
});

gulp.task("watch", function() {
  gulp.watch(cssPath, ["bootstrap"]);
});

gulp.task("default", ["bootstrap"], function(cb) {
  console.log("done");
});
