import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from 'viem'
import { stdio, lspActions } from '../../src/index.js'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('typescript-language-server', () => {
  const fixturesPath = path.resolve(__dirname, 'fixtures')
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

    // Initialize the server
    const initResult = await client.initialize({
      processId: process.pid,
      rootUri: `file://${fixturesPath}`,
      capabilities: {
        textDocument: {
          hover: { contentFormat: ['markdown', 'plaintext'] },
          completion: {
            completionItem: { snippetSupport: true },
          },
        },
      },
      workspaceFolders: null,
    })

    expect(initResult.capabilities).toBeDefined()

    // Send initialized notification
    await client.initialized()

    // Open the test document
    await client.didOpen({
      textDocument: {
        uri: testFileUri,
        languageId: 'typescript',
        version: 1,
        text: testFileContent,
      },
    })
  })

  afterAll(async () => {
    await client.shutdown()
    await client.exit()
  })

  it('should provide hover information', async () => {
    // Hover over "createUser" function name (line 6, char 16)
    const hover = await client.hover({
      textDocument: { uri: testFileUri },
      position: { line: 5, character: 16 },
    })

    expect(hover).toBeDefined()
    expect(hover?.contents).toBeDefined()
  })

  it('should provide completions', async () => {
    // Get completions after "user." (line 13, char 17)
    const completions = await client.completion({
      textDocument: { uri: testFileUri },
      position: { line: 12, character: 17 },
    })

    expect(completions).toBeDefined()
    if (Array.isArray(completions)) {
      expect(completions.length).toBeGreaterThan(0)
    } else if (completions) {
      expect(completions.items.length).toBeGreaterThan(0)
    }
  })

  it('should provide go to definition', async () => {
    // Go to definition of "createUser" call (line 12, char 13)
    const definition = await client.definition({
      textDocument: { uri: testFileUri },
      position: { line: 11, character: 13 },
    })

    expect(definition).toBeDefined()
  })

  it('should provide document symbols', async () => {
    const symbols = await client.documentSymbol({
      textDocument: { uri: testFileUri },
    })

    expect(symbols).toBeDefined()
    expect(Array.isArray(symbols)).toBe(true)
    if (symbols) {
      expect(symbols.length).toBeGreaterThan(0)
    }
  })

  it('should provide references', async () => {
    // Find references to "User" interface (line 0, char 17)
    const references = await client.references({
      textDocument: { uri: testFileUri },
      position: { line: 0, character: 17 },
      context: { includeDeclaration: true },
    })

    expect(references).toBeDefined()
    expect(Array.isArray(references)).toBe(true)
  })

  it('should handle document changes', async () => {
    const newContent = testFileContent + '\nconst newVar = 42;'

    await client.didChange({
      textDocument: { uri: testFileUri, version: 2 },
      contentChanges: [{ text: newContent }],
    })

    // Verify the change was processed by checking hover on new content
    const hover = await client.hover({
      textDocument: { uri: testFileUri },
      position: { line: testFileContent.split('\n').length, character: 6 },
    })

    expect(hover).toBeDefined()
  })
})
