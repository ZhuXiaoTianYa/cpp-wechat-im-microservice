.PHONY:all
all:main icsearch
main:main.cc
	g++ -std=c++11 $^ -o $@ -lcpr -lelasticlient
icsearch:icsearch.cc
	g++ -std=c++11 $^ -o $@ -lcpr -lelasticlient -ljsoncpp -lspdlog -lfmt -lgflags
.PHONY:clean
clean:
	rm -f main icsearch