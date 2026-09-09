# Starter Maintenance

Keep template metadata and guidance aligned with the v4 application shape in [AGENTS.md](../AGENTS.md). The source template belongs under `templates/base/src`; metadata changes must keep `templates/base/package.json` installable from the public npm registry.

Run the three root gates after each change:

```sh
npm run typecheck
npm test
npm run build
```

These commands run a read-only audit of the published dependency ranges, local CLI scripts, and required v4 guidance.
