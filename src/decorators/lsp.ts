import type { Client, Transport } from 'viem'

import {
  type InitializeParameters,
  type InitializeReturnType,
  initialize,
} from '../actions/lifecycle/initialize.js'
import {
  type InitializedParameters,
  initialized,
} from '../actions/lifecycle/initialized.js'
import { shutdown } from '../actions/lifecycle/shutdown.js'
import { exit } from '../actions/lifecycle/exit.js'

import {
  type HoverParameters,
  type HoverReturnType,
  hover,
} from '../actions/textDocument/hover.js'
import {
  type CompletionParameters,
  type CompletionReturnType,
  completion,
} from '../actions/textDocument/completion.js'
import {
  type DefinitionParameters,
  type DefinitionReturnType,
  definition,
} from '../actions/textDocument/definition.js'
import {
  type ReferencesParameters,
  type ReferencesReturnType,
  references,
} from '../actions/textDocument/references.js'
import {
  type DocumentSymbolParameters,
  type DocumentSymbolReturnType,
  documentSymbol,
} from '../actions/textDocument/documentSymbol.js'
import {
  type DidOpenParameters,
  didOpen,
} from '../actions/textDocument/didOpen.js'
import {
  type DidChangeParameters,
  didChange,
} from '../actions/textDocument/didChange.js'
import {
  type DidCloseParameters,
  didClose,
} from '../actions/textDocument/didClose.js'
import {
  type DidSaveParameters,
  didSave,
} from '../actions/textDocument/didSave.js'
import {
  type FormattingParameters,
  type FormattingReturnType,
  formatting,
} from '../actions/textDocument/formatting.js'
import {
  type CodeActionParameters,
  type CodeActionReturnType,
  codeAction,
} from '../actions/textDocument/codeAction.js'
import {
  type SignatureHelpParameters,
  type SignatureHelpReturnType,
  signatureHelp,
} from '../actions/textDocument/signatureHelp.js'
import {
  type RenameParameters,
  type RenameReturnType,
  rename,
} from '../actions/textDocument/rename.js'
import {
  type PrepareRenameParameters,
  type PrepareRenameReturnType,
  prepareRename,
} from '../actions/textDocument/prepareRename.js'

export type LspActions<transport extends Transport = Transport> = {
  // Lifecycle
  initialize: (params: InitializeParameters) => Promise<InitializeReturnType>
  initialized: (params?: InitializedParameters) => Promise<void>
  shutdown: () => Promise<void>
  exit: () => Promise<void>

  // Text Document
  hover: (params: HoverParameters) => Promise<HoverReturnType>
  completion: (params: CompletionParameters) => Promise<CompletionReturnType>
  definition: (params: DefinitionParameters) => Promise<DefinitionReturnType>
  references: (params: ReferencesParameters) => Promise<ReferencesReturnType>
  documentSymbol: (params: DocumentSymbolParameters) => Promise<DocumentSymbolReturnType>
  didOpen: (params: DidOpenParameters) => Promise<void>
  didChange: (params: DidChangeParameters) => Promise<void>
  didClose: (params: DidCloseParameters) => Promise<void>
  didSave: (params: DidSaveParameters) => Promise<void>
  formatting: (params: FormattingParameters) => Promise<FormattingReturnType>
  codeAction: (params: CodeActionParameters) => Promise<CodeActionReturnType>
  signatureHelp: (params: SignatureHelpParameters) => Promise<SignatureHelpReturnType>
  rename: (params: RenameParameters) => Promise<RenameReturnType>
  prepareRename: (params: PrepareRenameParameters) => Promise<PrepareRenameReturnType>
}

export function lspActions<transport extends Transport = Transport>(
  client: Client<transport>,
): LspActions<transport> {
  return {
    // Lifecycle
    initialize: (args) => initialize(client, args),
    initialized: (args) => initialized(client, args),
    shutdown: () => shutdown(client),
    exit: () => exit(client),

    // Text Document
    hover: (args) => hover(client, args),
    completion: (args) => completion(client, args),
    definition: (args) => definition(client, args),
    references: (args) => references(client, args),
    documentSymbol: (args) => documentSymbol(client, args),
    didOpen: (args) => didOpen(client, args),
    didChange: (args) => didChange(client, args),
    didClose: (args) => didClose(client, args),
    didSave: (args) => didSave(client, args),
    formatting: (args) => formatting(client, args),
    codeAction: (args) => codeAction(client, args),
    signatureHelp: (args) => signatureHelp(client, args),
    rename: (args) => rename(client, args),
    prepareRename: (args) => prepareRename(client, args),
  }
}
