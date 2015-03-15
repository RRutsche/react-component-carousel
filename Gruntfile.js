module.exports = function (grunt) {

	// load grunt modules
	require('load-grunt-tasks')(grunt);

	// set grunt settings
	var port = grunt.option('port') || grunt.option('p') || 8080;

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Web Server
		connect: {
			server: {
				options: {
					port: port,
					base: 'www/'
				}
			}
		},

		// checking JS files for correct code (even JSX)
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true
			},
			all: ['Gruntfile.js', 'src/**/*.js', 'src/**/*.jsx']
		},

		// do something on file change
		watch: {
			// common options
			options: {
				livereload: (port === 80 ? true : 1337),
				spawn: false
			},

			// restart grunt on Gruntfile change
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['logSettings', 'jshint', 'build-dev'],
				reload: true,
				livereload: false
			},
			// Re-build react js
			react: {
				files: ['src/**/*.js', 'src/**/*.jsx'],
				tasks: ['logSettings', 'jshint', 'react']
			}
		},

		// clean directories for re-compiling
		clean: {
			build: 'build/*'
		},
		// concatenate all files into one after react compilation
		browserify: {
			options: {
				transform: ['reactify']
			},
			// compile react js
			react: {
				src: ['src/Carousel.jsx'],
				dest: 'build/Carousel.js'
			}
		},

		react: {
			single_file_output: {
				files: {
					'build/Carousel.js': 'src/Carousel.jsx'
				}
    		},
		}		
	});

	// Show current settings
	grunt.registerTask('logSettings', 'Echos settings to console', function () {
		grunt.log.subhead('Settings:');
		grunt.log.writeln('-----------------------');
		grunt.log.writeln('Server port: ' + port);
		grunt.log.writeln('-----------------------');
	});

	grunt.registerTask('build-dev', ['clean:build', 'react']);
	grunt.registerTask('default', ['logSettings', 'build-dev', 'connect', 'watch']);
	grunt.registerTask('dev', ['logSettings', 'build-dev']);
};