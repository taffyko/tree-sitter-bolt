import XCTest
import SwiftTreeSitter
import TreeSitterBolt

final class TreeSitterBoltTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_bolt())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Bolt grammar")
    }
}
