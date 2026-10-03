#include <argparse/argparse.hpp>
#include <spdlog/spdlog.h>

#include <exception>
#include <iostream>

int main(int argc, char** argv)
{
  argparse::ArgumentParser cli(APP_NAME, APP_VERSION);

  cli.add_argument("--verbose").help("enable debug logs").flag();

  try {
    cli.parse_args(argc, argv);
  } catch (const std::exception& e) {
    std::cerr << e.what() << '\n' << cli;
    return 1;
  }

  if (cli.get<bool>("--verbose"))
    spdlog::set_level(spdlog::level::debug);

  spdlog::info("Hello from {}", APP_NAME);
  return 0;
}
