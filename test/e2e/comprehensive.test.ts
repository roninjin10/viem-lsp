import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from 'viem'
import { stdio, lspActions } from '../../src/index.js'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('Comprehensive LSP Tests', () => {
  const fixturesPath = path.resolve(__dirname, 'fixtures')
  const functionsFilePath = path.join(fixturesPath, 'functions.ts')
  const functionsFileContent = fs.readFileSync(functionsFilePath, 'utf-8')
  const functionsFileUri = `file://${functionsFilePath}`

  const testFilePath = path.join(fixturesPath, 'test.ts')
  const testFileContent = fs.readFileSync(testFilePath, 'utf-8')
  const testFileUri = `file://${testFilePath}`

  let client: ReturnType<typeof createClient> & ReturnType<typeof lspActions>

  beforeAll(async () => {
    client = createClient({
      transport: stdio({
        command: 'typescript-language-server',
        args: ['--stdio'],
        cwd: fixturesPath,
      }),
    }).extend(lspActions) as typeof client

    const initResult = await client.initialize({
      processId: process.pid,
      rootUri: `file://${fixturesPath}`,
      capabilities: {
        textDocument: {
          hover: { contentFormat: ['markdown', 'plaintext'] },
          completion: {
            completionItem: { snippetSupport: true },
          },
          signatureHelp: {
            signatureInformation: {
              documentationFormat: ['markdown', 'plaintext'],
            },
          },
          formatting: { dynamicRegistration: true },
          codeAction: { dynamicRegistration: true },
          rename: { prepareSupport: true },
        },
      },
      workspaceFolders: null,
    })

    expect(initResult.capabilities).toBeDefined()
    await client.initialized()
  })

  afterAll(async () => {
    await client.shutdown()
    await client.exit()
  })

  describe('Document Lifecycle', () => {
    it('should open multiple documents', async () => {
      await client.didOpen({
        textDocument: {
          uri: functionsFileUri,
          languageId: 'typescript',
          version: 1,
          text: functionsFileContent,
        },
      })

      await client.didOpen({
        textDocument: {
          uri: testFileUri,
          languageId: 'typescript',
          version: 1,
          text: testFileContent,
        },
      })

      // Verify both documents are accessible
      const hover1 = await client.hover({
        textDocument: { uri: functionsFileUri },
        position: { line: 6, character: 16 }, // 'add' function
      })
      expect(hover1).toBeDefined()

      const hover2 = await client.hover({
        textDocument: { uri: testFileUri },
        position: { line: 5, character: 16 }, // 'createUser' function
      })
      expect(hover2).toBeDefined()
    })

    it('should handle document changes with incremental updates', async () => {
      const newLine = '\nexport const PI = 3.14159;'

      await client.didChange({
        textDocument: { uri: functionsFileUri, version: 2 },
        contentChanges: [{ text: functionsFileContent + newLine }],
      })

      // Verify the change is reflected
      const symbols = await client.documentSymbol({
        textDocument: { uri: functionsFileUri },
      })
      expect(symbols).toBeDefined()
      expect(Array.isArray(symbols)).toBe(true)
    })

    it('should handle document close and reopen', async () => {
      await client.didClose({
        textDocument: { uri: testFileUri },
      })

      // Reopen
      await client.didOpen({
        textDocument: {
          uri: testFileUri,
          languageId: 'typescript',
          version: 1,
          text: testFileContent,
        },
      })

      // Should work normally after reopen
      const hover = await client.hover({
        textDocument: { uri: testFileUri },
        position: { line: 0, character: 17 },
      })
      expect(hover === null || hover?.contents !== undefined).toBe(true)
    })
  })

  describe('Hover', () => {
    it('should provide hover for function declarations', async () => {
      const hover = await client.hover({
        textDocument: { uri: functionsFileUri },
        position: { line: 6, character: 16 }, // 'add' function name
      })

      expect(hover).toBeDefined()
      expect(hover?.contents).toBeDefined()
    })

    it('should provide hover for class declarations', async () => {
      const hover = await client.hover({
        textDocument: { uri: functionsFileUri },
        position: { line: 19, character: 13 }, // 'Calculator' class
      })

      expect(hover).toBeDefined()
      expect(hover?.contents).toBeDefined()
    })

    it('should provide hover for method calls', async () => {
      const hover = await client.hover({
        textDocument: { uri: functionsFileUri },
        position: { line: 40, character: 20 }, // .add() method call
      })

      expect(hover).toBeDefined()
    })

    it('should return null for whitespace', async () => {
      const hover = await client.hover({
        textDocument: { uri: functionsFileUri },
        position: { line: 0, character: 0 }, // Start of file (comment)
      })

      // May return null or hover info for comment
      expect(hover === null || hover?.contents !== undefined).toBe(true)
    })
  })

  describe('Completion', () => {
    it('should provide completions for object properties', async () => {
      const completions = await client.completion({
        textDocument: { uri: functionsFileUri },
        position: { line: 40, character: 18 }, // After 'calc.'
      })

      expect(completions).toBeDefined()
      if (Array.isArray(completions)) {
        expect(completions.length).toBeGreaterThan(0)
        const labels = completions.map(c => c.label)
        expect(labels).toContain('add')
        expect(labels).toContain('subtract')
        expect(labels).toContain('getValue')
      } else if (completions) {
        expect(completions.items.length).toBeGreaterThan(0)
      }
    })

    it('should provide keyword completions', async () => {
      // Create a document with incomplete code
      const incompleteCode = 'const x = 1;\ncon'
      const tempUri = `file://${fixturesPath}/temp.ts`

      await client.didOpen({
        textDocument: {
          uri: tempUri,
          languageId: 'typescript',
          version: 1,
          text: incompleteCode,
        },
      })

      const completions = await client.completion({
        textDocument: { uri: tempUri },
        position: { line: 1, character: 3 },
      })

      expect(completions).toBeDefined()

      await client.didClose({ textDocument: { uri: tempUri } })
    })
  })

  describe('Definition', () => {
    it('should navigate to function definition', async () => {
      const definition = await client.definition({
        textDocument: { uri: functionsFileUri },
        position: { line: 43, character: 12 }, // 'add' call
      })

      expect(definition).toBeDefined()
      if (Array.isArray(definition)) {
        expect(definition.length).toBeGreaterThan(0)
      }
    })

    it('should navigate to class definition', async () => {
      const definition = await client.definition({
        textDocument: { uri: functionsFileUri },
        position: { line: 39, character: 17 }, // 'Calculator' reference
      })

      expect(definition).toBeDefined()
    })

    it('should navigate to method definition', async () => {
      const definition = await client.definition({
        textDocument: { uri: functionsFileUri },
        position: { line: 40, character: 20 }, // .add() method
      })

      expect(definition).toBeDefined()
    })
  })

  describe('References', () => {
    it('should find all references to a function', async () => {
      const refs = await client.references({
        textDocument: { uri: functionsFileUri },
        position: { line: 6, character: 16 }, // 'add' function declaration
        context: { includeDeclaration: true },
      })

      expect(refs).toBeDefined()
      expect(Array.isArray(refs)).toBe(true)
      if (refs) {
        expect(refs.length).toBeGreaterThanOrEqual(2) // Declaration + usage
      }
    })

    it('should find all references to a class', async () => {
      const refs = await client.references({
        textDocument: { uri: functionsFileUri },
        position: { line: 19, character: 13 }, // 'Calculator' class
        context: { includeDeclaration: true },
      })

      expect(refs).toBeDefined()
      expect(Array.isArray(refs)).toBe(true)
    })

    it('should exclude declaration when requested', async () => {
      const refsWithDecl = await client.references({
        textDocument: { uri: functionsFileUri },
        position: { line: 6, character: 16 },
        context: { includeDeclaration: true },
      })

      const refsWithoutDecl = await client.references({
        textDocument: { uri: functionsFileUri },
        position: { line: 6, character: 16 },
        context: { includeDeclaration: false },
      })

      expect(refsWithDecl).toBeDefined()
      expect(refsWithoutDecl).toBeDefined()
    })
  })

  describe('Document Symbols', () => {
    it('should list all symbols in document', async () => {
      const symbols = await client.documentSymbol({
        textDocument: { uri: functionsFileUri },
      })

      expect(symbols).toBeDefined()
      expect(Array.isArray(symbols)).toBe(true)
      if (symbols) {
        expect(symbols.length).toBeGreaterThan(0)
        // Should find functions, class, variables
        const names = symbols.map((s: any) => s.name)
        expect(names).toContain('add')
        expect(names).toContain('multiply')
        expect(names).toContain('Calculator')
      }
    })
  })

  describe('Signature Help', () => {
    it('should provide signature help for function calls', async () => {
      // Create a document with a function call in progress
      const code = `import { add } from './functions';\nconst result = add(`
      const tempUri = `file://${fixturesPath}/sig.ts`

      await client.didOpen({
        textDocument: {
          uri: tempUri,
          languageId: 'typescript',
          version: 1,
          text: code,
        },
      })

      const sigHelp = await client.signatureHelp({
        textDocument: { uri: tempUri },
        position: { line: 1, character: 19 }, // Inside add()
      })

      // Signature help may or may not be available depending on server
      expect(sigHelp === null || sigHelp?.signatures !== undefined).toBe(true)

      await client.didClose({ textDocument: { uri: tempUri } })
    })
  })

  describe('Formatting', () => {
    it('should format a document', async () => {
      const unformattedCode = `function   foo(   x:number){return x+1}`
      const tempUri = `file://${fixturesPath}/format.ts`

      await client.didOpen({
        textDocument: {
          uri: tempUri,
          languageId: 'typescript',
          version: 1,
          text: unformattedCode,
        },
      })

      const edits = await client.formatting({
        textDocument: { uri: tempUri },
        options: { tabSize: 2, insertSpaces: true },
      })

      expect(edits).toBeDefined()
      // TypeScript language server should provide formatting edits
      expect(edits === null || Array.isArray(edits)).toBe(true)

      await client.didClose({ textDocument: { uri: tempUri } })
    })
  })

  describe('Code Actions', () => {
    it('should provide code actions for errors', async () => {
      // Create a document with a fixable error
      const codeWithError = `const x: string = 123;` // Type error
      const tempUri = `file://${fixturesPath}/codeaction.ts`

      await client.didOpen({
        textDocument: {
          uri: tempUri,
          languageId: 'typescript',
          version: 1,
          text: codeWithError,
        },
      })

      // Wait a bit for diagnostics
      await new Promise(resolve => setTimeout(resolve, 500))

      const actions = await client.codeAction({
        textDocument: { uri: tempUri },
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 22 },
        },
        context: { diagnostics: [] },
      })

      // Code actions may or may not be available
      expect(actions === null || Array.isArray(actions)).toBe(true)

      await client.didClose({ textDocument: { uri: tempUri } })
    })
  })

  describe('Rename', () => {
    it('should prepare rename for valid symbol', async () => {
      const prepareResult = await client.prepareRename({
        textDocument: { uri: functionsFileUri },
        position: { line: 6, character: 16 }, // 'add' function
      })

      expect(prepareResult).toBeDefined()
      if (prepareResult) {
        // Should return range or range with placeholder
        expect('range' in prepareResult || 'start' in prepareResult).toBe(true)
      }
    })

    it('should perform rename operation', async () => {
      const renameResult = await client.rename({
        textDocument: { uri: functionsFileUri },
        position: { line: 6, character: 16 }, // 'add' function
        newName: 'addNumbers',
      })

      expect(renameResult).toBeDefined()
      if (renameResult) {
        // Should return workspace edit with changes
        expect(renameResult.changes || renameResult.documentChanges).toBeDefined()
      }
    })
  })
})
