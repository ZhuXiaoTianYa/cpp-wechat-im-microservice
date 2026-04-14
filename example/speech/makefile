.PHONY:asr_test
asr_test:asr_test.cc
	g++  -std=c++11 $^ -o $@ -lcurl -lcrypto -ljsoncpp -lspdlog -lfmt -lgflags

.PHONY:clean
clean:
	rm -rf asr_test