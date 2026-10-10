import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';

function files(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(`${dir}/${entry.name}`) : /\.tsx?$/.test(entry.name) ? [`${dir}/${entry.name}`] : []);
}
const sources = files('src');

test('client runtime import graphs cannot reach database or email modules', () => {
    const clients = sources.filter(file => /^['"]use client['"]/.test(readFileSync(file, 'utf8').trimStart()));
    assert(clients.length > 0, 'At least one client entry must be checked');
    for (const client of clients) {
        const seen = new Set();
        function visit(file) {
            if (seen.has(file)) return;
            seen.add(file);
            const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
            for (const node of ast.statements) {
                if (!ts.isImportDeclaration(node) && !ts.isExportDeclaration(node)) continue;
                if (!node.moduleSpecifier || node.importClause?.isTypeOnly || node.isTypeOnly) continue;
                const specifier = node.moduleSpecifier.text;
                assert(!/^(server-only|resend|@supabase\/)/.test(specifier), `${client} reaches ${specifier}`);
                if (!specifier.startsWith('.') && !specifier.startsWith('@/')) continue;
                const base = specifier.startsWith('@/') ? resolve('src', specifier.slice(2)) : resolve(dirname(file), specifier);
                const target = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`].find(existsSync);
                if (target) visit(target);
            }
        }
        visit(resolve(client));
    }
});

test('only the critical homepage image opts into preload', () => {
    const critical = [];
    for (const file of sources) {
        const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
        function visit(node) {
            if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(ast) === 'Image') {
                const names = node.attributes.properties.map(property => property.name?.getText(ast));
                assert(names.includes('sizes'), `${file}: responsive image hint missing`);
                assert(names.includes('alt'), `${file}: alt missing`);
                if (names.includes('preload') || names.includes('priority')) critical.push(file);
            }
            ts.forEachChild(node, visit);
        }
        visit(ast);
    }
    assert.deepEqual(critical, ['src/app/page.tsx']);
});
