# app_name

Uses [Puffin](https://github.com/4thlabs/puffin), [spdlog](https://github.com/gabime/spdlog) and
[argparse](https://github.com/p-ranav/argparse), fetched by CMake at configure time with `FetchContent`. Link the Puffin
modules you need in `CMakeLists.txt`, and change a `GIT_TAG` there to use another version.

## Build

Requirements: a C++20 compiler and CMake 3.24 or newer.

```sh
cmake --preset default
cmake --build --preset default
ctest --preset default
./build/debug/app_name --help
```

Use the `release` presets for an optimized build.
