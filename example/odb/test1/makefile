.PHONY: main
main:main.cc person-odb.cxx
	g++ -std=c++17 $^ -o $@ -lodb-mysql -lodb -lodb-boost
.PHONY:clean
clean:
	rm -rf main