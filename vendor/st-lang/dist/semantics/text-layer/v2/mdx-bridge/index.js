"use strict";
/**
 * ST Text Layer 2.0 — MDX bridge.
 *
 * Conversión bidireccional Claim[] ↔ MDX con diff de cambios.
 *
 *   mdxToClaims(mdx)            → MDXClaim[]
 *   claimsToMDX(claims, opts?)  → string
 *   diffMDX(before, after)      → MDXDelta
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffMDX = exports.claimsToMDX = exports.stripMDXMetadata = exports.mdxToClaimsDetailed = exports.mdxToClaims = void 0;
var parser_1 = require("./parser");
Object.defineProperty(exports, "mdxToClaims", { enumerable: true, get: function () { return parser_1.mdxToClaims; } });
Object.defineProperty(exports, "mdxToClaimsDetailed", { enumerable: true, get: function () { return parser_1.mdxToClaimsDetailed; } });
Object.defineProperty(exports, "stripMDXMetadata", { enumerable: true, get: function () { return parser_1.stripMDXMetadata; } });
var serializer_1 = require("./serializer");
Object.defineProperty(exports, "claimsToMDX", { enumerable: true, get: function () { return serializer_1.claimsToMDX; } });
var diff_1 = require("./diff");
Object.defineProperty(exports, "diffMDX", { enumerable: true, get: function () { return diff_1.diffMDX; } });
//# sourceMappingURL=index.js.map