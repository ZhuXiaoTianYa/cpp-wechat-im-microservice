.PHONY: main
main:main.cc student-odb.cxx
	g++ -std=c++17 $^ -o $@ -lodb-mysql -lodb -lodb-boost -lgflags
.PHONY:clean
clean:
	rm -rf main