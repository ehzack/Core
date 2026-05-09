/**
 * @file build-docs.ts
 * @description Aggregates documentation from the monorepo and generates API references using TypeDoc.
 */

import * as fs from 'fs'
import * as path from 'path'
import { spawnSync } from 'child_process'

const ROOT_DIR: string = path.join(__dirname, '..')
const DOCS_DIR: string = path.join(ROOT_DIR, 'docs', 'pages')
const API_REF_DIR: string = path.join(DOCS_DIR, 'api-reference')

// Directories to scan for documentation
const SCAN_DIRS: string[] = ['packages', 'apps', 'containers']
const TARGET_FILES: string[] = ['README.md', 'HOWTO.md']

/**
 * Capitalizes and formats a package name (e.g., 'auth-firebase' -> 'Auth Firebase')
 */
function formatTitle(name: string): string {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

/**
 * Copies documentation files from source to destination
 */
function aggregateMarkdownFiles(sourceDir: string): void {
    const fullSourcePath: string = path.join(ROOT_DIR, sourceDir)
    console.info(`[INFO] Scanning ${sourceDir} for Markdown files...`)
    
    if (!fs.existsSync(fullSourcePath)) {
        console.warn(`[WARN] Directory does not exist: ${fullSourcePath}`)
        return
    }

    try {
        const items = fs.readdirSync(fullSourcePath)
        const dirMeta: Record<string, string> = {}
        const baseTargetDir = path.join(DOCS_DIR, sourceDir)
        
        if (!fs.existsSync(baseTargetDir)) {
            fs.mkdirSync(baseTargetDir, { recursive: true })
        }

        for (const item of items) {
            const itemPath = path.join(fullSourcePath, item)
            if (fs.statSync(itemPath).isDirectory()) {
                let hasDocs = false
                const itemMeta: Record<string, string> = {}

                for (const targetFile of TARGET_FILES) {
                    const filePath = path.join(itemPath, targetFile)
                    if (fs.existsSync(filePath)) {
                        hasDocs = true
                        const targetDir = path.join(baseTargetDir, item)
                        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
                        
                        const destFileName = targetFile.toLowerCase()
                        fs.copyFileSync(filePath, path.join(targetDir, destFileName))
                        itemMeta[destFileName.replace('.md', '')] = targetFile === 'README.md' ? 'Overview' : targetFile.replace('.md', '')
                    }
                }

                if (hasDocs) {
                    fs.writeFileSync(path.join(baseTargetDir, item, '_meta.js'), `export default ${JSON.stringify(itemMeta, null, 2)}`)
                    dirMeta[item] = formatTitle(item)
                }
            }
        }

        if (Object.keys(dirMeta).length > 0) {
            fs.writeFileSync(path.join(baseTargetDir, '_meta.js'), `export default ${JSON.stringify(dirMeta, null, 2)}`)
        }
    } catch (error) {
        console.error(`[ERROR] Failed to aggregate files in ${sourceDir}:`, error)
    }
}

/**
 * Generates API documentation using TypeDoc.
 */
function generateApiReference(): void {
    console.info('[INFO] Generating API Reference with TypeDoc...')
    
    if (fs.existsSync(API_REF_DIR)) fs.rmSync(API_REF_DIR, { recursive: true, force: true })
    fs.mkdirSync(API_REF_DIR, { recursive: true })

    const tempTsConfigPath = path.join(ROOT_DIR, 'tsconfig.typedoc.json')
    const tempTsConfig = {
        extends: './tsconfig.json',
        compilerOptions: { 
            jsx: "react-jsx", 
            isolatedModules: false, 
            skipLibCheck: true,
            checkJs: false
        },
        include: ['packages/*/src/**/*'],
        exclude: [
            "node_modules", 
            "**/dist", 
            "**/lib", 
            "**/*.test.ts", 
            "**/*.spec.ts", 
            "**/__tests__/**/*", 
            "**/__test__/**/*"
        ]
    }
    fs.writeFileSync(tempTsConfigPath, JSON.stringify(tempTsConfig, null, 2))

    // DEBUG: Permettre de limiter aux 5 premiers packages si DOCS_DEBUG est défini
    let entryPoints = ['packages/*/src/index.ts']
    if (process.env.DOCS_DEBUG) {
        console.info('[DEBUG] DOCS_DEBUG mode: limiting to first 5 packages')
        const allPackages = fs.readdirSync(path.join(ROOT_DIR, 'packages'))
            .filter(p => fs.existsSync(path.join(ROOT_DIR, 'packages', p, 'src', 'index.ts')))
            .slice(0, 5)
            .map(p => `packages/${p}/src/index.ts`)
        entryPoints = allPackages
    }

    const args = [
        'typedoc',
        '--plugin', 'typedoc-plugin-markdown',
        '--out', API_REF_DIR,
        '--entryPointStrategy', 'resolve',
        '--excludePrivate',
        '--excludeInternal',
        '--skipErrorChecking', // IGNORER les erreurs TypeScript pour accélérer et éviter les blocages
        '--tsconfig', 'tsconfig.typedoc.json',
        ...entryPoints
    ]

    console.info(`[INFO] Executing: yarn ${args.join(' ')}`)
    
    const result = spawnSync('yarn', args, {
        cwd: ROOT_DIR,
        stdio: 'inherit',
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=10240' }
    })

    if (fs.existsSync(tempTsConfigPath)) fs.unlinkSync(tempTsConfigPath)

    if (result.error || result.status !== 0) {
        console.error(`[ERROR] TypeDoc failed (code ${result.status}):`, result.error || '')
        process.exit(1)
    }
    console.info('[INFO] API Reference generated successfully.')
}

function main(): void {
    console.info('--- Documentation Build Start ---')
    const start = Date.now()
    generateApiReference()
    for (const dir of SCAN_DIRS) aggregateMarkdownFiles(dir)
    console.info(`--- Documentation Build Finished in ${((Date.now() - start) / 1000).toFixed(2)}s ---`)
}

main()
