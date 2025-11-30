/**
 * @file Bolt grammar for tree-sitter
 * @author taffyko
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// grammar.js
module.exports = grammar({
  name: 'bolt',

  // whitespace and comments that can appear between tokens
  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  externals: $ => [
    $._block_comment_content,
  ],

  // used for incremental parsing & some editor features
  word: $ => $.identifier,

  rules: {
    source_file: $ =>
      repeat($._top_level_item),

    _top_level_item: $ =>
      choice(
        $.block,
        $._token
      ),

    _token: $ =>
      choice(
        $.keyword,
        $.type_keyword,
        $.identifier,
        $.number_literal,
        $.string_literal,
        $.boolean_literal,
        $.null_literal,
        $.this,
        $.array_literal,
        $.operator,
        $.punctuation
      ),

    block: $ =>
      seq(
        '{',
        repeat(choice($.block, $._token)),
        '}'
      ),

    keyword: $ =>
      choice(
        // keyword.control.bolt
        'if',
        'else',
        'for',
        'return',
        'break',
        'continue',
        'do',
        'then',

        // keyword.control.other.bolt
        'fn',
        'import',
        'from',
        'as',
        'export',
        'type',
        'typeof',
        'let',
        'const',
        'final',
        'unsealed',
        'enum',
        'in',
        'by',
        'to',
        'and',
        'or',
        'not',
        'is',
        'match'
      ),

    // entity.name.type
    type_keyword: $ =>
      choice(
        'any',
        'number',
        'string',
        'bool',
        'array',
        'table',
        'module',
        'Type'
      ),

    // keyword.operator.arithmetic.bolt
    arithmetic_operator: $ =>
      token(choice(
        '+',
        '-',
        '*',
        '/'
      )),

    // keyword.operator.other.bolt
    other_operator: $ =>
      token(choice(
        '>',
        '>=',
        '<',
        '<=',
        '=',
        '==',
        '=>',
        '!=',
        '??'
      )),

    operator: $ =>
      choice(
        $.arithmetic_operator,
        $.other_operator
      ),

    // punctuation.bolt
    punctuation: $ =>
      token(choice(
        '.',
        ',',
        ':',
        '!',
        '?',
        '?.'
      )),

    // constant.numeric.bolt
    number_literal: $ =>
      token(/\d[\d_]*(\.[\d_]+)?/),

    // constant.language.bolt
    boolean_literal: $ =>
      choice('true', 'false'),

    null_literal: $ =>
      'null',

    // variable.parameter.bolt (this)
    this: $ =>
      'this',

    // constant.other.array.bolt
    array_literal: $ =>
      seq(
        '[',
        optional(seq(
          $._array_item,
          repeat(seq(',', $._array_item))
        )),
        ']'
      ),

    _array_item: $ =>
      choice(
        $.block,
        $._token
      ),

    // string.quoted.double.bolt
    string_literal: $ =>
      seq(
        '"',
        repeat(choice(
          $.escape_sequence,
          // Anything but quote or backslash
          token(/[^"\\]+/)
        )),
        '"'
      ),

    // constant.character.escape.bolt
    escape_sequence: $ =>
      token(/\\./),

    // variable.bolt
    identifier: $ =>
      token(/(@|_|\w)(@|_|\w|\d)*/),

    line_comment: $ =>
      token(seq('//', /.*/)),

    block_comment: $ => seq(
      '/*',
      optional(
        $._block_comment_content,
      ),
      '*/',
    ),
  }
});
