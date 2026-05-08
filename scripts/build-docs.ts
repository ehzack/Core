/**
 * @file build-docs.ts
 * @description Aggregates documentation from the monorepo and generates API references using TypeDoc.
 * This script prepares the Nextra documentation site before the final static build.
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
 * Copies documentation files from source to destination, maintaining the hierarchy.
 * @param sourceDir The base directory to scan (e.g., 'packages').
 */
function aggregateMarkdownFiles(sourceDir: string): void {
    const fullSourcePath: string = path.join(ROOT_DIR, sourceDir)
    
    if (!fs.existsSync(fullSourcePath)) {
        console.warn(`[WARN] Directory does not exist, skipping: ${fullSourcePath}`)
        return
    }

    try {
        const items: string[] = fs.readdirSync(fullSourcePath)
        for (const item of items) {
            const itemPath: string = path.join(fullSourcePath, item)
            
            if (fs.statSync(itemPath).isDirectory()) {
                for (const targetFile of TARGET_FILES) {
                    const filePath: string = path.join(itemPath, targetFile)
                    if (fs.existsSync(filePath)) {
                        const targetDir: string = path.join(DOCS_DIR, sourceDir, item)
                        
                        // Ensure target directory exists
                        if (!fs.existsSync(targetDir)) {
                            fs.mkdirSync(targetDir, { recursive: true })
                        }
                        
                        // Rename file to lowercase as requested (e.g., HOWTO.md -> howto.md)
                        const destPath: string = path.join(targetDir, targetFile.toLowerCase())
                        fs.copyFileSync(filePath, destPath)
                        console.info(`[INFO] Copied ${filePath} to ${destPath}`)
                    }
                }
            }
        }
    } catch (error: any) {
        console.error(`[ERROR] Failed to aggregate markdown files in ${sourceDir}:`, error)
    }
}

/**
 * Generates API documentation using TypeDoc.
 */
function generateApiReference(): void {
    console.info('[INFO] Generating API Reference with TypeDoc...')
    
    // Clean previous API reference to prevent stale documentation
    if (fs.existsSync(API_REF_DIR)) {
        fs.rmSync(API_REF_DIR, { recursive: true, force: true })
    }
    fs.mkdirSync(API_REF_DIR, { recursive: true })

    // Generate a temporary tsconfig.json that includes all entry points.
    // The root tsconfig.json has "files": [], which causes TypeDoc to reject entry points.
    const tempTsConfigPath = path.join(ROOT_DIR, 'tsconfig.typedoc.json')
    const tempTsConfig = {
        extends: './tsconfig.json',
        include: ['packages/*/src/**/*'],
        exclude: [
            "node_modules",
            "**/dist",
            "**/lib",
            "**/*.test.ts",
            "**/*.spec.ts",
            "**/__tests__/**/*",
            "**/__mocks__/**/*",
            "**/fixtures/**/*",
            "**/*.fixture.ts"
        ]
    }
    fs.writeFileSync(tempTsConfigPath, JSON.stringify(tempTsConfig, null, 2))

    // We use yarn to run typedoc so it executes within the Plug'n'Play environment.
    // This allows TypeDoc to resolve workspace dependencies like @tsconfig/recommended.
    const result = spawnSync('yarn', [
        'typedoc',
        '--plugin', 'typedoc-plugin-markdown',
        '--out', API_REF_DIR,
        '--entryPointStrategy', 'resolve',
        '--tsconfig', 'tsconfig.typedoc.json',
        '--exclude', '**/*.test.ts',
        '--exclude', '**/*.spec.ts',
        '--exclude', '**/__tests__/**/*',
        '--exclude', '**/__mocks__/**/*',
        '--exclude', '**/fixtures/**/*',
        'packages/*/src/index.ts'
    ], {
        cwd: ROOT_DIR,
        shell: false,
        stdio: 'inherit'
    })

    // Clean up temporary tsconfig
    if (fs.existsSync(tempTsConfigPath)) {
        fs.unlinkSync(tempTsConfigPath)
    }

    if (result.error) {
        console.error('[ERROR] Failed to start TypeDoc process:', result.error)
        process.exit(1)
    }

    if (result.status !== 0) {
        console.error(`[ERROR] TypeDoc generation failed with exit code ${result.status}`)
        process.exit(1)
    }

    console.info('[INFO] API Reference generated successfully.')
}

/**
 * Main execution function.
 */
function main(): void {
    console.info('[INFO] Starting documentation aggregation...')
    
    // 1. Generate API Reference
    generateApiReference()

    // 2. Aggregate manually written Markdown files
    for (const dir of SCAN_DIRS) {
        aggregateMarkdownFiles(dir)
    }

    console.info('[INFO] Documentation aggregation completed successfully.')
}

main()
