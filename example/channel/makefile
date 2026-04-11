.PHONY:all registry discovery
all:registry discovery
registry:registry.cc main.pb.cc
	g++ -std=c++17 $^ -o $@ -lgflags -lfmt -lspdlog -letcd-cpp-api -lcpprest -lbrpc -lleveldb -lgflags -lssl -lcrypto -lprotobuf
discovery:discovery.cc main.pb.cc
	g++ -std=c++17 $^ -o $@ -lgflags -lfmt -lspdlog -letcd-cpp-api -lcpprest -lbrpc -lleveldb -lgflags -lssl -lcrypto -lprotobuf

.PHONY:clean
clean:
	rm -f registry discovery