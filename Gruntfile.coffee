module.exports = ->
	sourceFiles = [
		'src/index.coffee'
		'src/utils/*.coffee'
		'src/model/*.coffee'
		'src/view/*.coffee'
	]

	@initConfig(
		coffee:
			default:
				options:
					sourceMap: true
					bare: false
					join: true
				files:
					'dist/fingerboard.js': sourceFiles
			test:
				options:
					sourceMap: false
					bare: true
					join: true
				files:
					'dist/fingerboard-test.js': sourceFiles
					'specs/model.js': ['specs/model.coffee']
					'specs/view.js': ['specs/view.js']
		jasmine:
			default:
				src: 'dist/fingerboard-test.js'
				options:
					specs: 'specs/*.js'
					template: 'specs/specRunner.tmpl'
		uglify:
			default:
				files:
					'dist/fingerboard.min.js': ['dist/fingerboard.js']
		clean:
			test: ['specs/*.js','dist/fingerboard-test.js']
		watch:
			default:
				files: sourceFiles
				tasks: ['coffee:default']
				options:
					atBegin: true
					spawn: false
			withTests:
				files:
					sourceFiles.concat [
						'specs/model.coffee'
						'specs/view.coffee'
					]
				tasks: ['test']
				options:
					atBegin: true

	)

	@loadNpmTasks('grunt-contrib-concat')
	@loadNpmTasks('grunt-contrib-uglify')
	@loadNpmTasks('grunt-contrib-watch')
	@loadNpmTasks('grunt-contrib-coffee')
	@loadNpmTasks('grunt-contrib-jasmine')
	@loadNpmTasks('grunt-contrib-clean')

	@registerTask('test', ['coffee:test', 'jasmine', 'clean:test'])
	@registerTask('build', ['test', 'coffee:default'])
	@registerTask('package', ['build', 'uglify:default'])
