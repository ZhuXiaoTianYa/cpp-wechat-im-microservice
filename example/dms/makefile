.PHONY:all main dms_test
all:main dms_test
main:main.cc
	g++ -std=c++11 $^ -o $@ -lcurl -lcrypto
dms_test:dms_test.cc
	g++ -std=c++11 $^ -o $@ -lcurl -lcrypto -lspdlog -lfmt -lgflags
.PHONY:clean
clean:
	rm -f main dms_test 