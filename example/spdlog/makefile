.PHONY: all sync async main
all:sync async main
sync:sync.cc
	g++ -std=c++17 $^ -o $@ -lspdlog -lfmt
async:async.cc
	g++ -std=c++17 $^ -o $@ -lspdlog -lfmt
main:main.cc
	g++ -std=c++17 $^ -o $@ -lspdlog -lfmt -lgflags
.PHONY:clean
clean:
	rm -rf sync async main log.txt main.log