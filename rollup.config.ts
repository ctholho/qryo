import type { OutputOptions, RollupOptions } from 'rollup'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import size from 'rollup-plugin-size'
import visualizer from 'rollup-plugin-visualizer'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonJS from '@rollup/plugin-commonjs'
import path from 'path'

type Options = {
  input: string | string[]
  packageDir: string
  external: RollupOptions['external']
  jsName: string
  outputFile: string
  globals: Record<string, string>
  forceDevEnv: boolean
  forceBundle: boolean
}

const forceEnvPlugin = (type: 'development' | 'production') =>
  replace({
    'process.env.NODE_ENV': `"${type}"`,
    delimiters: ['', ''],
    preventAssignment: true,
  })

const babelPlugin = babel({
  babelHelpers: 'bundled',
  exclude: /node_modules/,
  extensions: ['.ts', '.tsx', '.native.ts'],
})

export default function rollup(options: RollupOptions): RollupOptions[] {
  return [
    ...buildConfigs({
      name: 'qryo',
      packageDir: 'packages/qryo',
      jsName: 'Qryo',
      outputFile: 'index',
      entryFile: ['src/index.ts'],
      globals: { 
        '@directus/sdk': 'Directus',
        '@tanstack/vue-query': 'Query',
        'vue': 'vue'
      },
    }),
    ...buildConfigs({
      name: 'indirectus',
      packageDir: 'packages/indirectus',
      jsName: 'InDirectus',
      outputFile: 'index',
      entryFile: ['src/index.ts'],
      globals: {
        '@akronym/qryo': 'Qryo',
      },
    }),
  ]
}

function buildConfigs(opts: {
  packageDir: string
  name: string
  jsName: string
  outputFile: string
  entryFile: string | string[]
  globals: Record<string, string>
  // This option allows to bundle specified dependencies for umd build
  bundleUMDGlobals?: string[]
  // Force prod env build
  forceDevEnv?: boolean
  forceBundle?: boolean
  skipUmdBuild?: boolean
}): RollupOptions[] {
  const firstEntry = path.resolve(
    opts.packageDir,
    Array.isArray(opts.entryFile) ? opts.entryFile[0] : opts.entryFile,
  )
  const entries = Array.isArray(opts.entryFile)
    ? opts.entryFile
    : [opts.entryFile]
  const input = entries.map((entry) => path.resolve(opts.packageDir, entry))
  const externalDeps = Object.keys(opts.globals)

  const bundleUMDGlobals = opts.bundleUMDGlobals || []
  const umdExternal = externalDeps.filter(
    (external) => !bundleUMDGlobals.includes(external),
  )

  const external = (moduleName) => externalDeps.includes(moduleName)

  const options: Options = {
    input,
    jsName: opts.jsName,
    outputFile: opts.outputFile,
    packageDir: opts.packageDir,
    external,
    globals: opts.globals,
    forceDevEnv: opts.forceDevEnv || false,
    forceBundle: opts.forceBundle || false,
  }

  let builds = [mjs(options), esm(options), cjs(options)]

  if (!opts.skipUmdBuild) {
    builds = builds.concat([
      umdDev({ ...options, external: umdExternal, input: firstEntry }),
      umdProd({ ...options, external: umdExternal, input: firstEntry }),
    ])
  }

  return builds
}

function mjs({
  input,
  packageDir,
  external,
  outputFile,
  forceDevEnv,
  forceBundle,
}: Options): RollupOptions {
  const bundleOutput: OutputOptions = {
    format: 'esm',
    file: `${packageDir}/build/lib/${outputFile}.mjs`,
    sourcemap: true,
  }

  const normalOutput: OutputOptions = {
    format: 'esm',
    dir: `${packageDir}/build/lib`,
    sourcemap: true,
    preserveModules: true,
    entryFileNames: '[name].mjs',
  }

  return {
    // ESM
    external,
    input,
    output: forceBundle ? bundleOutput : normalOutput,
    plugins: [
      babelPlugin,
      commonJS(),
      nodeResolve({ extensions: ['.ts', '.tsx', '.native.ts'] }),
      forceDevEnv ? forceEnvPlugin('development') : undefined,
    ],
  }
}

function esm({
  input,
  packageDir,
  external,
  outputFile,
  forceDevEnv,
  forceBundle,
}: Options): RollupOptions {
  const bundleOutput: OutputOptions = {
    format: 'esm',
    file: `${packageDir}/build/lib/${outputFile}.esm.js`,
    sourcemap: true,
  }

  const normalOutput: OutputOptions = {
    format: 'esm',
    dir: `${packageDir}/build/lib`,
    sourcemap: true,
    preserveModules: true,
    entryFileNames: '[name].esm.js',
  }

  return {
    // ESM
    external,
    input,
    output: forceBundle ? bundleOutput : normalOutput,
    plugins: [
      babelPlugin,
      commonJS(),
      nodeResolve({ extensions: ['.ts', '.tsx', '.native.ts'] }),
      forceDevEnv ? forceEnvPlugin('development') : undefined,
    ],
  }
}

function cjs({
  input,
  external,
  packageDir,
  outputFile,
  forceDevEnv,
  forceBundle,
}: Options): RollupOptions {
  const bundleOutput: OutputOptions = {
    format: 'cjs',
    file: `${packageDir}/build/lib/${outputFile}.js`,
    sourcemap: true,
    exports: 'named',
  }

  const normalOutput: OutputOptions = {
    format: 'cjs',
    dir: `${packageDir}/build/lib`,
    sourcemap: true,
    exports: 'named',
    preserveModules: true,
    entryFileNames: '[name].js',
  }
  return {
    // CJS
    external,
    input,
    output: forceBundle ? bundleOutput : normalOutput,
    plugins: [
      babelPlugin,
      commonJS(),
      nodeResolve({ extensions: ['.ts', '.tsx', '.native.ts'] }),
      forceDevEnv ? forceEnvPlugin('development') : undefined,
      replace({
        // TODO: figure out a better way to produce extensionless cjs imports
        "require('./logger.js')": "require('./logger')",
        "require('./reactBatchedUpdates.js')": "require('./reactBatchedUpdates')",
        "require('./useSyncExternalStore.js')": "require('./useSyncExternalStore')",
        preventAssignment: true,
        delimiters: ['', ''],
      }),
    ],
  }
}

function umdDev({
  input,
  external,
  packageDir,
  outputFile,
  globals,
  jsName,
}: Options): RollupOptions {
  return {
    // UMD (Dev)
    external,
    input,
    output: {
      format: 'umd',
      sourcemap: true,
      file: `${packageDir}/build/umd/${outputFile}.development.js`,
      name: jsName,
      globals,
    },
    plugins: [
      commonJS(),
      babelPlugin,
      nodeResolve({ extensions: ['.ts', '.tsx', '.native.ts'] }),
      forceEnvPlugin('development'),
    ],
  }
}

function umdProd({
  input,
  external,
  packageDir,
  outputFile,
  globals,
  jsName,
}: Options): RollupOptions {
  return {
    // UMD (Prod)
    external,
    input,
    output: {
      format: 'umd',
      sourcemap: true,
      file: `${packageDir}/build/umd/${outputFile}.production.js`,
      name: jsName,
      globals,
    },
    plugins: [
      commonJS(),
      babelPlugin,
      nodeResolve({ extensions: ['.ts', '.tsx', '.native.ts'] }),
      forceEnvPlugin('production'),
      terser({
        mangle: true,
        compress: true,
      }),
      size({}),
      visualizer({
        filename: `${packageDir}/build/stats-html.html`,
        gzipSize: true,
      }),
      visualizer({
        filename: `${packageDir}/build/stats.json`,
        json: true,
        gzipSize: true,
      }),
    ],
  }
}
