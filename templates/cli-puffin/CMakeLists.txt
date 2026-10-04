cmake_minimum_required(VERSION 3.24)

project(app_name VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include(CTest)
include(cmake/CPM.cmake)

# Standalone asio has no CMakeLists.txt, expose it as asio::asio
CPMAddPackage(NAME asio GITHUB_REPOSITORY chriskohlhoff/asio GIT_TAG asio-1-38-2 DOWNLOAD_ONLY YES)
find_package(Threads REQUIRED)
add_library(asio INTERFACE)
add_library(asio::asio ALIAS asio)
target_include_directories(asio SYSTEM INTERFACE ${asio_SOURCE_DIR}/asio/include)
target_compile_definitions(asio INTERFACE ASIO_STANDALONE)
target_link_libraries(asio INTERFACE Threads::Threads)

# Lets Puffin build its asio adapters (puffin::async_asio, puffin::webkit_asio) on this asio
set(PUFFIN_ASIO_INCLUDE_DIR ${asio_SOURCE_DIR}/asio/include CACHE PATH "")

CPMAddPackage("gh:4thlabs/puffin#master")
CPMAddPackage("gh:gabime/spdlog@1.17.0")
CPMAddPackage("gh:p-ranav/argparse@3.2")

add_executable(app_name src/main.cpp)

# Also available: asio::asio and the Puffin modules puffin::async, puffin::async_asio, puffin::webkit,
# puffin::webkit_asio, puffin::webkit_asio_ssl (when OpenSSL is installed), puffin::imdb, puffin::events,
# puffin::ioc, puffin::maths, puffin::common
target_link_libraries(app_name PRIVATE spdlog::spdlog argparse::argparse)
target_compile_definitions(app_name PRIVATE APP_NAME="${PROJECT_NAME}" APP_VERSION="${PROJECT_VERSION}")

if(BUILD_TESTING)
  add_test(NAME app_name.version COMMAND app_name --version)
  set_tests_properties(app_name.version PROPERTIES PASS_REGULAR_EXPRESSION "${PROJECT_VERSION}")
endif()
