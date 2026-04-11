.PHONY:all registry discovery
all:registry discovery
registry:registry.cc
	g++ -std=c++17 $^ -o $@ -lgflags -lfmt -lspdlog -letcd-cpp-api -lcpprest
discovery:discovery.cc
	g++ -std=c++17 $^ -o $@ -lgflags -lfmt -lspdlog -letcd-cpp-api -lcpprest

.PHONY:clean
clean:
	rm -f registry discovery