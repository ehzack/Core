import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const ROOT_DIR = path.join(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');

let totalMissing = 0;
let totalExported = 0;

function walkDir(dir: string, callback: (filePath: string) => void) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath, callback);
        } else if (fullPath.endsWith('.ts') && !fullPath.endsWith('.test.ts') && !fullPath.endsWith('.spec.ts')) {
            callback(fullPath);
        }
    }
}

function hasJSDoc(node: ts.Node): boolean {
    const jsDocTags = ts.getJSDocTags(node);
    const jsDocComments = (node as any).jsDoc;
    return (jsDocTags && jsDocTags.length > 0) || (jsDocComments && jsDocComments.length > 0);
}

function checkNode(node: ts.Node, sourceFile: ts.SourceFile, filePath: string) {
    // Helper to get modifiers safely across TS versions
    const getModifiers = (n: ts.Node) => {
        if (ts.canHaveModifiers && ts.canHaveModifiers(n)) return ts.getModifiers(n) || [];
        return (n as any).modifiers || [];
    };

    const modifiers = getModifiers(node);
    const isExported = modifiers.some((m: any) => m.kind === ts.SyntaxKind.ExportKeyword);
    
    // Also check class members (methods, properties) of exported classes
    const parentModifiers = node.parent ? getModifiers(node.parent) : [];
    const isClassMember = ts.isClassElement(node) && node.parent && parentModifiers.some((m: any) => m.kind === ts.SyntaxKind.ExportKeyword);
    const isPublic = !modifiers.some((m: any) => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword);

    if (
        ((isExported || isClassMember) && isPublic) &&
        (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node))
    ) {
        // Skip constructors
        if (ts.isConstructorDeclaration(node)) return;

        totalExported++;

        if (!hasJSDoc(node)) {
            totalMissing++;
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            const typeName = ts.SyntaxKind[node.kind].replace('Declaration', '');
            let name = 'anonymous';
            if ((node as any).name && (node as any).name.text) {
                name = (node as any).name.text;
            }
            const relativePath = path.relative(ROOT_DIR, filePath);
            console.log(`[Missing] ${relativePath}:${line + 1}:${character + 1} - ${typeName} '${name}'`);
        }
    }

    ts.forEachChild(node, child => checkNode(child, sourceFile, filePath));
}

function auditPackages() {
    console.log('--- Starting JSDoc Audit ---');
    const packages = fs.readdirSync(PACKAGES_DIR);
    
    for (const pkg of packages) {
        const srcDir = path.join(PACKAGES_DIR, pkg, 'src');
        walkDir(srcDir, (filePath) => {
            const content = fs.readFileSync(filePath, 'utf-8');
            const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
            ts.forEachChild(sourceFile, node => checkNode(node, sourceFile, filePath));
        });
    }

    console.log('--- Audit Summary ---');
    console.log(`Total Exported Public Elements: ${totalExported}`);
    console.log(`Missing JSDoc: ${totalMissing}`);
    const percentage = ((totalMissing / totalExported) * 100).toFixed(2);
    console.log(`Compliance: ${totalExported === 0 ? 100 : (100 - parseFloat(percentage)).toFixed(2)}% documented.`);
}

auditPackages();
