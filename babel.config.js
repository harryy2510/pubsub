const libs = ['lodash-es']

module.exports = {
    plugins: libs.map((l) => [
        'import',
        { libraryName: l, libraryDirectory: '', camel2DashComponentName: false },
        l
    ]),
    presets: [
        ['@babel/preset-env', { modules: false }],
        ['react-app', { absoluteRuntime: false, flow: false, typescript: true }]
    ],
    sourceType: 'unambiguous',
    only: ['./src/**/*.ts', './src/**/*.tsx', './src/**/*.js', './src/**/*.jsx']
}
