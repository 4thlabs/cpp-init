# cpp-init

Scaffold a C++20 / CMake project, with or without [Puffin](https://github.com/4thlabs/puffin).

```sh
npx @4thlabs/cpp-init@latest my-app
# or, before the package is published to npm
npx github:4thlabs/cpp-init my-app
```

Without arguments the command asks for the directory, the template, whether to use Puffin and which Puffin version.
Every question can be answered on the command line instead:

```sh
npx @4thlabs/cpp-init@latest my-app --template cli --puffin-version master
npx @4thlabs/cpp-init@latest my-app --template cli --no-puffin
```

| Option | Description |
| --- | --- |
| `-t, --template <name>` | Template to use. |
| `--no-puffin` | Use the variant of the template without Puffin. |
| `--puffin-version <ref>` | Puffin git tag, branch or commit, `master` by default. |
| `-f, --force` | Write into a non-empty directory. |
| `-y, --yes` | Accept the defaults for every question. |

Then build the generated project:

```sh
cd my-app
cmake --preset default
cmake --build --preset default
ctest --preset default
```

Requirements: Node 18.3 or newer to generate, a C++20 compiler and CMake 3.24 or newer to build.

## Templates

| Template | Description |
| --- | --- |
| `cli` | Command line application using `puffin::async` and `puffin::events`. |
| `cli-bare` | The same application in plain C++20, picked by `cli --no-puffin`. |

## Writing a template

A template is a folder of `templates/` holding a real project that configures and builds as is, plus a
`template.json`:

```json
{
  "description": "Command line application using Puffin (async, events)",
  "puffin": true,
  "bare": "cli-bare",
  "replace": {
    "puffin_app": "{{name}}",
    "GIT_TAG master": "GIT_TAG {{puffin_version}}"
  }
}
```

- `replace` maps a string found in the template files to its value in the generated project. `{{name}}` is the
  project name (the directory name, lowercased), `{{puffin_version}}` the chosen Puffin version.
- `puffin` tells whether the template uses Puffin, so whether to ask for its version.
- `bare` names the variant without Puffin. Bare variants are not listed in the template question.
- Name `.gitignore` as `_gitignore`, npm strips `.gitignore` files when publishing.

CI generates and builds every template with GCC and Clang.
