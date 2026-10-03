cmake_minimum_required(VERSION 3.24)

project(app_name VERSION 0.1.0 LANGUAGES CXX)

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

add_executable(app_name src/main.cpp)
target_link_libraries(app_name PRIVATE puffin::async puffin::events)
target_compile_definitions(app_name PRIVATE APP_NAME="${PROJECT_NAME}" APP_VERSION="${PROJECT_VERSION}")

if(BUILD_TESTING)
  add_test(NAME app_name.version COMMAND app_name --version)
  add_test(NAME app_name.greet COMMAND app_name Ada Grace)
  set_tests_properties(app_name.greet PROPERTIES PASS_REGULAR_EXPRESSION "Hello, Grace!")
endif()
