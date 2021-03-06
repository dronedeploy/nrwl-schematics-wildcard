"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
function stripSourceCode(scanner, contents) {
    if (contents.indexOf('loadChildren') > -1) {
        return contents;
    }
    scanner.setText(contents);
    var token = scanner.scan();
    var statements = [];
    var start = null;
    while (token !== typescript_1.SyntaxKind.EndOfFileToken) {
        var potentialStart = scanner.getStartPos();
        switch (token) {
            case typescript_1.SyntaxKind.ImportKeyword: {
                token = scanner.scan();
                while (token === typescript_1.SyntaxKind.WhitespaceTrivia ||
                    token === typescript_1.SyntaxKind.NewLineTrivia) {
                    token = scanner.scan();
                }
                if (token !== typescript_1.SyntaxKind.OpenParenToken) {
                    start = potentialStart;
                }
                break;
            }
            case typescript_1.SyntaxKind.ExportKeyword: {
                token = scanner.scan();
                while (token === typescript_1.SyntaxKind.WhitespaceTrivia ||
                    token === typescript_1.SyntaxKind.NewLineTrivia) {
                    token = scanner.scan();
                }
                if (token === typescript_1.SyntaxKind.OpenBraceToken ||
                    token === typescript_1.SyntaxKind.AsteriskToken) {
                    start = potentialStart;
                }
                break;
            }
            case typescript_1.SyntaxKind.StringLiteral: {
                if (start !== null) {
                    token = scanner.scan();
                    var end = scanner.getStartPos();
                    statements.push(contents.substring(start, end));
                    start = null;
                }
                else {
                    token = scanner.scan();
                }
                break;
            }
            default: {
                token = scanner.scan();
            }
        }
    }
    return statements.join('\n');
}
exports.stripSourceCode = stripSourceCode;
