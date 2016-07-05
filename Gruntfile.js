module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            files: ['lib/**/*.js', 'test/**/*.js']
        },
        watch: {
            files: ['lib/**/*.js', 'test/**/*.js'],
            tasks : ['jshint']
        },
        coveralls: {
            // Options relevant to all targets
            options: {
                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: false
            },
            oauth: {
                // LCOV coverage file (can be string, glob or array)
                src: './coverage/*.info',
                options: {
                    // Any options for just this target
                }
            }
        }
    });
    
    

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.loadNpmTasks('grunt-coveralls');

    // Default task(s).
    grunt.registerTask('default', ['watch']);

};