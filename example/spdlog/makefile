.PHONY: all sync async
all:sync async
sync:sync.cc
	g++ -std=c++17 $^ -o $@ -lspdlog -lfmt
async:async.cc
	g++ -std=c++17 $^ -o $@ -lspdlog -lfmt
.PHONY:clean
clean:
	rm -rf sync async log.txt