.PHONY:all get put
all:get put 
get:get.cc
	g++ -std=c++17 $^ -o $@ -letcd-cpp-api -lcpprest
put:put.cc
	g++ -std=c++17 $^ -o $@ -letcd-cpp-api -lcpprest

.PHONY:clean
clean:
	rm -rf get put