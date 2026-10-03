cmake_minimum_required(VERSION 3.24)

project(puffin_app VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include(CTest)
include(FetchContent)

FetchContent_Declare(puffin
  GIT_REPOSITORY https://github.com/4thlabs/puffin.git
  GIT_TAG master
  GIT_SHALLOW ON
)
FetchContent_MakeAvailable(puffin)

add_executable(puffin_app src/main.cpp)
target_link_libraries(puffin_app PRIVATE puffin::async puffin::events)
target_compile_definitions(puffin_app PRIVATE APP_NAME="${PROJECT_NAME}" APP_VERSION="${PROJECT_VERSION}")

if(BUILD_TESTING)
  add_test(NAME puffin_app.version COMMAND puffin_app --version)
  add_test(NAME puffin_app.greet COMMAND puffin_app Ada Grace)
  set_tests_properties(puffin_app.greet PROPERTIES PASS_REGULAR_EXPRESSION "Hello, Grace!")
endif()
