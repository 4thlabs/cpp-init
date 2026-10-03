# cpp-init

Scaffold a C++ / CMake project from a template.

```sh
npx @4thlabs/cpp-init@latest my-app
# or, before the package is published to npm
npx github:4thlabs/cpp-init my-app
```

Without arguments the command asks for the directory and the template. Both can be given on the command line instead:

```sh
npx @4thlabs/cpp-init@latest my-app --template cli
```

| Option | Description |
| --- | --- |
| `-t, --template <name>` | Template to use. |
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
| `cli` | Command line application in plain C++20. |
| `cli-puffin` | Command line application with [Puffin](https://github.com/4thlabs/puffin), [spdlog](https://github.com/gabime/spdlog) and [clipp](https://github.com/muellan/clipp). |

## Writing a template

A template is a folder of `templates/` holding a real project that configures and builds as is, plus a
`template.json`:

```json
{
  "description": "Command line application in plain C++20",
  "replace": {
    "app_name": "{{name}}"
  }
}
```

- `replace` maps a string found in the template files to its value in the generated project. `{{name}}` is the
  project name (the directory name, lowercased). The templates use `app_name` as the project name placeholder.
- Name `.gitignore` as `_gitignore`, npm strips `.gitignore` files when publishing.

CI generates and builds every template with GCC and Clang.
