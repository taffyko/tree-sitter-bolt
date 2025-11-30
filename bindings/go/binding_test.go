package tree_sitter_bolt_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_bolt "github.com/taffyko/tree-sitter-bolt/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_bolt.Language())
	if language == nil {
		t.Errorf("Error loading Bolt grammar")
	}
}
