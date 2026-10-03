#include <clipp.h>
#include <spdlog/spdlog.h>

#include <iostream>

int main(int argc, char** argv)
{
  bool help = false;
  bool version = false;
  bool verbose = false;

  auto cli = (
    clipp::option("-h", "--help").set(help) % "show this help",
    clipp::option("-v", "--version").set(version) % "show the version",
    clipp::option("--verbose").set(verbose) % "enable debug logs"
  );

  if (!clipp::parse(argc, argv, cli) || help) {
    std::cout << clipp::make_man_page(cli, APP_NAME);
    return help ? 0 : 1;
  }

  if (version) {
    std::cout << APP_NAME << ' ' << APP_VERSION << '\n';
    return 0;
  }

  if (verbose)
    spdlog::set_level(spdlog::level::debug);

  spdlog::info("Hello from {}", APP_NAME);
  return 0;
}
