# puffin_app

Built on [Puffin](https://github.com/4thlabs/puffin), fetched by CMake at configure time (`FetchContent`, see
`CMakeLists.txt` to change the version).

## Build

Requirements: a C++20 compiler and CMake 3.24 or newer.

```sh
cmake --preset default
cmake --build --preset default
ctest --preset default
./build/debug/puffin_app Ada Grace
```

Use the `release` presets for an optimized build.
