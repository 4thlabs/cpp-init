#include <iostream>
#include <string>
#include <string_view>
#include <vector>

int main(int argc, char** argv)
{
  std::vector<std::string> names;

  for (int i = 1; i < argc; ++i) {
    std::string_view arg = argv[i];

    if (arg == "-h" || arg == "--help") {
      std::cout << "Usage: " << APP_NAME << " [name...]\n";
      return 0;
    }
    if (arg == "-v" || arg == "--version") {
      std::cout << APP_NAME << ' ' << APP_VERSION << '\n';
      return 0;
    }
    names.emplace_back(arg);
  }

  if (names.empty())
    names.emplace_back("world");

  for (const auto& name : names)
    std::cout << "Hello, " << name << "!\n";

  return 0;
}
