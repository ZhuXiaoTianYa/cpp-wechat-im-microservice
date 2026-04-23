.PHONY:main
main:main.cc
	g++ -std=c++11 $^ -o $@ -lcpr -lelasticlient -lspdlog -lfmt -ljsoncpp -lgflags
.PHONY:clean
clean:
	rm -f main 