# app_name

Uses [Puffin](https://github.com/4thlabs/puffin), [spdlog](https://github.com/gabime/spdlog),
[argparse](https://github.com/p-ranav/argparse) and [asio](https://think-async.com/Asio/), fetched by
[CPM.cmake](https://github.com/cpm-cmake/CPM.cmake) at configure time. Link the asio and Puffin targets you need in
`CMakeLists.txt`, and change a version in its `CPMAddPackage` calls to use another one. Set `CPM_SOURCE_CACHE` (for
example `export CPM_SOURCE_CACHE=$HOME/.cache/CPM`) to share the downloads between projects.

## Build

Requirements: a C++20 compiler and CMake 3.24 or newer.

```sh
cmake --preset default
cmake --build --preset default
ctest --preset default
./build/debug/app_name --help
```

Use the `release` presets for an optimized build.
