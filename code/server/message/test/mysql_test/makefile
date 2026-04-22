.PHONY: main
main:main.cc message-odb.cxx
	g++ -std=c++17 $^ -o $@ -I../../../odb/ -I./ -lodb-mysql -lodb -lodb-boost -lgflags -lspdlog -lfmt
.PHONY:clean
clean:
	rm -rf main