// The house dependency-cruiser preset, from the vendored house-style copy: no cycles, no unresolvable
// imports, a feature used through its index only, no Fastify in lib/. It runs once over both projects.
module.exports = { extends: "./vendor/house-style/.dependency-cruiser.cjs" };
