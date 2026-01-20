const gulp = require("gulp");
const ts = require("gulp-typescript");
const include = require("gulp-include");
const stripImportExport = require("gulp-strip-import-export");
const del = require("del");
const change = require("gulp-change");

const tsProject = ts.createProject("src/tsconfig.json");

// Очистка папки build
function clean() {
	return del(["build/**/*"]);
}

// Сборка TypeScript
function build() {
	return tsProject
		.src()
		.pipe(tsProject())
		.js.pipe(include({
			hardFail: true,
			includePaths: ["src"]
		}))
		.pipe(stripImportExport())
		.pipe(gulp.dest("build"));
}

// Оборачиваем только build/index.js в <% %>
function wrapIndex() {
	return gulp
		.src("build/index.js", { allowEmpty: true })
		.pipe(change(function(content) {
			const trimmed = content.trim();
			if (trimmed.startsWith("<%") && trimmed.endsWith("%>")) {
				return content;
			}

			return `<%\n${content}\n%>`;
		}))
		.pipe(gulp.dest("build"));
}

// Dev режим (watch)
function watch() {
	return gulp.watch("src/**/*.ts", gulp.series(build, wrapIndex));
}

// Экспорт задач
exports.clean = clean;
exports.build = gulp.series(clean, build, wrapIndex);
exports.dev = gulp.series(build, wrapIndex, watch);
exports.default = exports.build;
