# app_name

Built on [Puffin](https://github.com/4thlabs/puffin), fetched by CMake at configure time with `FetchContent`.
Change `GIT_TAG` in `CMakeLists.txt` to pin another Puffin version.

## Build

Requirements: a C++20 compiler and CMake 3.24 or newer.

```sh
cmake --preset default
cmake --build --preset default
ctest --preset default
./build/debug/app_name Ada Grace
```

Use the `release` presets for an optimized build.
