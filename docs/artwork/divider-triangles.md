# Divider triangle artwork

The user approved this candidate on 2026-09-09 after reviewing its small visual differences from the original. The four `line-*` variants replace solid conic-gradient zigzags with separated triangles. Public props, class names and separator semantics are unchanged.

## Approved geometry

The 260 × 12 brown, teal and yellow bands contain 13 triangles spaced 20px apart. Angles in degrees are 88, -8, 76, 12, 98, -14, 82, 5, 103, -6, 73, 10, 91. Colors are #d3ccbc, #008b83, #ffffff and #f0dc57. The white version uses a 680 × 12 band with 34 triangles; narrow containers crop that band instead of squeezing the white triangles. The other three bands shrink to fit containers narrower than 260px.

The SVG files under `src/components/Divider/assets/` are the exact geometry and colors from the approved preview, referenced by CSS and emitted with the package. Paths were independently authored from primitive triangles, not copied from the original SVG. The design intentionally remains close to the original; independent path authorship and visual approval are not legal clearance.

The already-approved wave and dashed variants remain as before this integration. Nothing was published or pushed.

Validation: library build, TypeScript, npm pack dry-run and Storybook build passed. All 11 Divider Storybook cases passed; six affected story screenshot baselines were updated. A real-browser check decoded all four SVG backgrounds, confirmed separator roles and no overflow at 280px viewport width, and confirmed dashed variants still repeat horizontally. All four exact SVGs are emitted under dist/files, included by npm pack and referenced by the built stylesheet. This is focused validation, not a full branch release gate.
