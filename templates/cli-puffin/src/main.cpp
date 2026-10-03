#include <puffin/async.hpp>
#include <puffin/events/event_bus.hpp>

#include <iostream>
#include <string>
#include <string_view>
#include <vector>

using namespace puffin::async;

struct greeted
{
  std::string name;
};

using app_events = puffin::events::events<greeted>;
using app_bus = puffin::events::event_bus<app_events>;

async<std::string> greet(std::string name)
{
  co_return "Hello, " + name + "!";
}

// Greets every name concurrently, then publishes one event per name.
async<> run(app_bus& bus, std::vector<std::string> names)
{
  std::vector<async<std::string>> tasks;
  for (const auto& name : names)
    tasks.push_back(greet(name));

  auto greetings = co_await when_all(std::move(tasks));

  for (std::size_t i = 0; i < greetings.size(); ++i) {
    std::cout << greetings[i] << '\n';
    bus.send(greeted{names[i]});
  }
}

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

  app_bus bus;
  int count = 0;
  bus.add_handler<greeted>([&count](const greeted&) { ++count; });

  thread_executor executor;
  executor.run(false);

  try {
    sync_wait(executor, run(bus, std::move(names)));
  } catch (const std::exception& e) {
    std::cerr << APP_NAME << ": " << e.what() << '\n';
    return 1;
  }

  std::cout << count << " name(s) greeted\n";
  return 0;
}
