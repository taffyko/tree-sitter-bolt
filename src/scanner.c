#include "tree_sitter/parser.h"
#include <stdbool.h>
#include <stdint.h>

// The order here must match the order of `externals` in grammar.js
enum TokenType {
    BLOCK_COMMENT_CONTENT,
};

void *tree_sitter_bolt_external_scanner_create(void) {
    // No persistent state needed
    return NULL;
}

void tree_sitter_bolt_external_scanner_destroy(void *payload) {
    // Nothing to free
}

unsigned tree_sitter_bolt_external_scanner_serialize(
    void *payload,
    char *buffer
) {
    // No state to maintain across tokens
    return 0;
}

void tree_sitter_bolt_external_scanner_deserialize(
    void *payload,
    const char *buffer,
    unsigned length
) {
    // No state to restore
}

static bool scan_block_comment_content(TSLexer *lexer) {
    // Called after the leading "/*" has already been consumed,
    // so set the initial depth to 1.
    unsigned depth = 1;

    for (;;) {
        int32_t c = lexer->lookahead;

        if (c == 0) {
            // EOF reached before closing "*/" of the outer comment.
            // Return false so the parser treats this as an error/unclosed comment.
            return false;
        }

        // Look for nested "/*"
        if (c == '/') {
            lexer->advance(lexer, false);
            if (lexer->lookahead == '*') {
                // "/*"
                depth++;
                lexer->advance(lexer, false); // consume '*'
                lexer->mark_end(lexer);
                continue;
            } else {
                // '/' not followed by '*'
                lexer->mark_end(lexer);
                continue;
            }
        }

        // Look for "*/"
        if (c == '*') {
            lexer->advance(lexer, false);
            if (lexer->lookahead == '/') {
                if (depth == 1) {
                    // About to hit the closing "*/" for the outermost comment.
                    // Do not call advance/mark_end to consume it here; leave it for the grammar's literal "*/".
                    return true;
                } else {
                    // Closing an inner nested comment: decrement depth and keep scanning.
                    depth--;
                    lexer->advance(lexer, false); // consume '/'
                    lexer->mark_end(lexer);
                    continue;
                }
            } else {
                // '*' not followed by '/'
                lexer->mark_end(lexer);
                continue;
            }
        }

        // Normal character inside the comment: consume and keep going.
        lexer->advance(lexer, false);
        lexer->mark_end(lexer);
    }
}

bool tree_sitter_bolt_external_scanner_scan(
    void *payload,
    TSLexer *lexer,
    const bool *valid_symbols
) {
    if (!valid_symbols[BLOCK_COMMENT_CONTENT]) {
        return false;
    }

    if (scan_block_comment_content(lexer)) {
        lexer->result_symbol = BLOCK_COMMENT_CONTENT;
        return true;
    }

    return false;
}
