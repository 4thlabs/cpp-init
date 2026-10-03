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
FetchContent_Declare(spdlog
  GIT_REPOSITORY https://github.com/gabime/spdlog.git
  GIT_TAG v1.17.0
  GIT_SHALLOW ON
)
# clipp master: the v1.2.3 release has no CMakeLists.txt
FetchContent_Declare(clipp
  GIT_REPOSITORY https://github.com/muellan/clipp.git
  GIT_TAG 2c32b2f1f7cc530b1ec1f62c92f698643bb368db
)
FetchContent_MakeAvailable(puffin spdlog clipp)

add_executable(app_name src/main.cpp)

# Puffin modules: puffin::async, puffin::webkit, puffin::imdb, puffin::events, puffin::ioc, puffin::maths, puffin::common
target_link_libraries(app_name PRIVATE spdlog::spdlog clipp::clipp)
target_compile_definitions(app_name PRIVATE APP_NAME="${PROJECT_NAME}" APP_VERSION="${PROJECT_VERSION}")

if(BUILD_TESTING)
  add_test(NAME app_name.version COMMAND app_name --version)
  set_tests_properties(app_name.version PROPERTIES PASS_REGULAR_EXPRESSION "${PROJECT_VERSION}")
endif()
